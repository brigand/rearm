import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import '@babel/polyfill';
import { render, fireEvent } from '@testing-library/react';
import useBreakpoint from '../BreakpointHooks';

const breakpoints = [
  { name: 'small', maxWidth: 600 },
];

it(`works`, async () => {
  function Test() {
    const bp = useBreakpoint(breakpoints);

    return (
      <React.Fragment>
        <p data-testid="info">Sm: {bp.isEq('small').toString()}</p>
      </React.Fragment>
    );
  }

  const { getByTestId } = render(<Test />);
  const node = getByTestId('info');

  window.innerWidth = 600;
  fireEvent(window, new Event('resize'));
  expect(node).toHaveTextContent("Sm: true");
});

