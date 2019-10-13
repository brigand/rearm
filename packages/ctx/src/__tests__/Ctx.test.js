import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import '@babel/polyfill';
import { render } from '@testing-library/react';
import { makeCtx } from '../ctx';

it(`works`, () => {
  const Ctx = makeCtx();

  function B() {
    const x = Ctx.use((state) => state.x);
    return <p>state.x: {x}</p>;
  }

  class A extends React.Component {
    render() {
      return (
        <Ctx.Provider value={{ x: this.props.x }}>
          <B />
        </Ctx.Provider>
      );
    }
  }

  const { getByText } = render(<A x="foo" />);
  expect(getByText('state.x: foo')).toBeTruthy();
});

it(`changes value`, () => {
  const Ctx = makeCtx();

  function B() {
    const x = Ctx.use((state) => state.x);
    return <p>state.x: {x}</p>;
  }

  class A extends React.Component {
    render() {
      return (
        <Ctx.Provider value={{ x: this.props.x }}>
          <B />
        </Ctx.Provider>
      );
    }
  }

  const { getByText, rerender } = render(<A x="foo" />);
  rerender(<A x="bar" />);
  expect(getByText('state.x: bar')).toBeTruthy();
});

it(`.use() component self-updates on store change`, () => {
  const Ctx = makeCtx();

  class NeverUpdate extends React.Component {
    shouldComponentUpdate() {
      return false;
    }
    render() {
      return this.props.children;
    }
  }

  function B() {
    const x = Ctx.use((state) => state.x);
    return <p>state.x: {x}</p>;
  }

  class A extends React.Component {
    render() {
      return (
        <Ctx.Provider value={{ x: this.props.x }}>
          <NeverUpdate>
            <B />
          </NeverUpdate>
        </Ctx.Provider>
      );
    }
  }

  const { getByText, rerender } = render(<A x="foo" />);
  rerender(<A x="bar" />);
  expect(getByText('state.x: bar')).toBeTruthy();
});
