import * as React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Ctx from '../Ctx';

configure({ adapter: new Adapter() });

it(`works`, () => {
  const B = () => (
    <Ctx>
      {data => <span id="target">{ data.x }</span>}
    </Ctx>
  );
  class A extends React.Component {
    render() {
      return (
        <Ctx inject={{ x: 'test' }}>
          <B />
        </Ctx>
      );
    }
  }

  const inst = mount(<A />);
  const text = inst.find('span').props().children;
  expect(text).toBe('test');
});

it(`updates one level`, () => {
  const B = () => (
    <Ctx>
      {data => <span id="target">{ data.x }</span>}
    </Ctx>
  );
  class A extends React.Component {
    state = {
      x: 'foo',
    }
    render() {
      return (
        <Ctx inject={{ x: this.state.x }}>
          <B />
        </Ctx>
      );
    }
  }

  const inst = mount(<A />);
  expect(inst.find('span').props().children).toBe('foo');
  inst.setState({ x: 'bar' });
  expect(inst.find('span').props().children).toBe('bar');
});

it(`updates two levels`, () => {
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
          <B />
        </Ctx>
      );
    }
  }

  const inst = mount(<A />);
  expect(inst.find('span').props().children).toBe('foo baz');
  inst.setState({ x: 'bar' });
  expect(inst.find('span').props().children).toBe('bar baz');
});


it(`updates two levels state in middle`, () => {
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
