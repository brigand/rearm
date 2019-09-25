import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import '@babel/polyfill';
import { render } from '@testing-library/react';
import { makeCtx } from '../CtxHooks';

const Ctx = makeCtx();

it(`works`, () => {
  function B() {
    const x = Ctx.use(state => state.x);
    return <p>Hello {x}</p>;
  }

  class A extends React.Component {
    render() {
      return (
        <Ctx.Provider set={{ x: this.props.x, y: 'a' }}>
          <B />
        </Ctx.Provider>
      );
    }
  }

  const { getByText, rerender } = render(<A x="foo" />);
  // rerender(<A x="bar" />);
  expect(getByText('Hello foo')).toBeTruthy();
});

