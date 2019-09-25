import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import '@babel/polyfill';
import { render } from '@testing-library/react';
import { makeCtx } from '../CtxHooks';


it(`works`, () => {
  const Ctx = makeCtx();

  function B() {
    const x = Ctx.use(state => state.x);
    return <p>Hello {x}</p>;
  }

  class A extends React.Component {
    render() {
      return (
        <Ctx.Provider value={{ x: this.props.x, y: 'a' }}>
          <B />
        </Ctx.Provider>
      );
    }
  }

  const { getByText } = render(<A x="foo" />);
  expect(getByText('Hello foo')).toBeTruthy();
});

it(`changes value`, () => {
  const Ctx = makeCtx();

  function B() {
    const x = Ctx.use(state => state.x);
    return <p>Hello {x}</p>;
  }

  class A extends React.Component {
    render() {
      return (
        <Ctx.Provider value={{ x: this.props.x, y: 'a' }}>
          <B />
        </Ctx.Provider>
      );
    }
  }

  const { getByText, rerender } = render(<A x="foo" />);
  rerender(<A x="bar" />);
  expect(getByText('Hello bar')).toBeTruthy();
});

it(`declines update`, () => {
  const Ctx = makeCtx();

  class NeverUpdate extends React.Component { shouldComponentUpdate() { return false; } render() { return this.props.children; } }

  function B() {
    const x = Ctx.use(state => state.x);
    return <p>Hello {x}</p>;
  }

  class A extends React.Component {
    render() {
      return (
        <Ctx.Provider value={{ x: this.props.x, y: 'a' }}>
          <NeverUpdate><B /></NeverUpdate>
        </Ctx.Provider>
      );
    }
  }

  const { getByText, rerender } = render(<A x="foo" />);
  rerender(<A x="bar" />);
  expect(getByText('Hello bar')).toBeTruthy();
});

