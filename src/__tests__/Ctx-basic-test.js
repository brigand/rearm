import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import '@babel/polyfill';
import { render, fireEvent } from '@testing-library/react';
import { makeCtx } from '../Ctx';

const Ctx = makeCtx('AppStore');

function pureHoc(C) {
  return class PureWrapper extends React.PureComponent {
    render() {
      return <C {...this.props} />;
    }
  };
}

it(`works`, () => {
  const B = pureHoc(() => (
    <Ctx>
      {data => <span id="target">{ data.x }</span>}
    </Ctx>
  ));
  class A extends React.Component {
    render() {
      return (
        <Ctx set={{ x: 'test' }}>
          <B />
        </Ctx>
      );
    }
  }

  const { getByText } = render(<A />);
  expect(getByText('test')).toBeTruthy();
});

xit(`updates one level`, async () => {
  const B = pureHoc(() => (
    <Ctx>
      {data => <span id="target">{data.x}</span>}
    </Ctx>
  ));

  class A extends React.Component {
    render() {
      return (
        <Ctx set={{ x: this.props.x }}>
          <B />
        </Ctx>
      );
    }
  }

  const { getByText, findByText, rerender } = render(<A x="foo" />);
  expect(getByText('foo')).toBeTruthy();
  await rerender(<A x="bar" />);
  expect(await findByText('bar')).toBeTruthy();
});

xit(`updates two levels`, () => {
  const C = () => (
    <Ctx>
      {data => <span id="target">{ `${data.x} ${data.y}` }</span>}
    </Ctx>
  );
  const B = () => (
    <Ctx inject={{ y: 'baz' }}>
      <C />
    </Ctx>
  );
  class A extends React.Component {
    state = {
      x: 'foo',
    }
    render() {
      return (
        <Ctx inject={{ x: this.state.x }}>
          <div>
            {this.state.x}
            <B />
          </div>
        </Ctx>
      );
    }
  }

  const inst = mount(<A />);
  expect(inst.find('span').props().children).toBe('foo baz');
  inst.setState({ x: 'bar' });
  expect(inst.find('span').props().children).toBe('bar baz');
});


xit(`updates two levels state in middle`, () => {
  const C = () => (
    <Ctx>
      {data => <span id="target">{ `${data.x} ${data.y}` }</span>}
    </Ctx>
  );
  class B extends React.Component {
    state = {
      x: 'foo',
    }
    render() {
      return (
        <Ctx inject={{ x: this.state.x }}>
          <C />
        </Ctx>
      );
    }
  }
  /* eslint-disable */
  const A = (props) => (
    <Ctx inject={{ y: 'baz' }}>
      <B ref={props.bRef} />
    </Ctx>
  );
  /* eslint-enable */

  let bRef = null;
  const inst = mount(<A bRef={(x) => { bRef = x; }} />);
  expect(inst.find('span').props().children).toBe('foo baz');
  bRef.setState({ x: 'bar' });
  inst.update();
  expect(inst.find('span').props().children).toBe('bar baz');
});
