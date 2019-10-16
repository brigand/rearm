import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import '@babel/polyfill';
import { render, fireEvent } from '@testing-library/react';
import useBreakpoint from '../BreakpointHooks';

function testChannel() {
  const testId = `test-channel-1`;

  function Send({ children }) {
    return <div data-testid={testId}>{JSON.stringify(children)}</div>;
  }

  function receive(getByTestId) {
    return JSON.parse(getByTestId(testId).textContent);
  }

  return { Send, receive };
}

it(`works with one breakpoint`, async () => {
  const breakpoints = [
    { name: 'small', maxWidth: 600 },
  ];
  const channel = testChannel();

  function Test() {
    const bp = useBreakpoint(breakpoints);

    return (
      <React.Fragment>
        <channel.Send>
          {
            {
              small: {
                isEq: bp.isEq('small'),
                isLt: bp.isLt('small'),
                isLte: bp.isLte('small'),
                isGt: bp.isGt('small'),
                isGte: bp.isGte('small'),
              },
            }
          }
        </channel.Send>
      </React.Fragment>
    );
  }

  const { getByTestId } = render(<Test />);
  window.innerWidth = 600;
  fireEvent(window, new Event('resize'));
  expect(channel.receive(getByTestId)).toEqual({
    small: {
      isEq: true,
      isLt: false,
      isLte: true,
      isGt: false,
      isGte: true,
    },
  });
});

it(`works with two breakpoints`, async () => {
  const breakpoints = [
    { name: 'small', maxWidth: 600 },
    { name: 'medium', minWidth: 601, maxWidth: 1199 },
  ];
  const channel = testChannel();

  function Test() {
    const bp = useBreakpoint(breakpoints);

    return (
      <React.Fragment>
        <channel.Send>
          {
            {
              small: {
                isEq: bp.isEq('small'),
                isLt: bp.isLt('small'),
                isLte: bp.isLte('small'),
                isGt: bp.isGt('small'),
                isGte: bp.isGte('small'),
              },
              medium: {
                isEq: bp.isEq('medium'),
                isLt: bp.isLt('medium'),
                isLte: bp.isLte('medium'),
                isGt: bp.isGt('medium'),
                isGte: bp.isGte('medium'),
              },
            }
          }
        </channel.Send>
      </React.Fragment>
    );
  }

  const { getByTestId } = render(<Test />);
  window.innerWidth = 601;
  fireEvent(window, new Event('resize'));
  expect(channel.receive(getByTestId)).toEqual({
    small: {
      isEq: false,
      isLt: false,
      isLte: false,
      isGt: true,
      isGte: true,
    },
    medium: {
      isEq: true,
      isLt: false,
      isLte: true,
      isGt: false,
      isGte: true,
    },
  });
});

it(`works with three breakpoints`, async () => {
  const breakpoints = [
    { name: 'small', maxWidth: 600 },
    { name: 'medium', minWidth: 'small', maxWidth: 'large' },
    { name: 'large', minWidth: 1200, exact: true },
  ];
  const channel = testChannel();

  function Test() {
    const bp = useBreakpoint(breakpoints);

    return (
      <React.Fragment>
        <channel.Send>
          {
            {
              small: {
                isEq: bp.isEq('small'),
                isLt: bp.isLt('small'),
                isLte: bp.isLte('small'),
                isGt: bp.isGt('small'),
                isGte: bp.isGte('small'),
              },
              medium: {
                isEq: bp.isEq('medium'),
                isLt: bp.isLt('medium'),
                isLte: bp.isLte('medium'),
                isGt: bp.isGt('medium'),
                isGte: bp.isGte('medium'),
              },
              large: {
                isEq: bp.isEq('large'),
                isLt: bp.isLt('large'),
                isLte: bp.isLte('large'),
                isGt: bp.isGt('large'),
                isGte: bp.isGte('large'),
              },
            }
          }
        </channel.Send>
      </React.Fragment>
    );
  }

  const { getByTestId } = render(<Test />);
  window.innerWidth = 800;
  fireEvent(window, new Event('resize'));
  expect(channel.receive(getByTestId)).toEqual({
    small: {
      isEq: false,
      isLt: false,
      isLte: false,
      isGt: true,
      isGte: true,
    },
    medium: {
      isEq: true,
      isLt: false,
      isLte: true,
      isGt: false,
      isGte: true,
    },
    large: {
      isEq: false,
      isLt: true,
      isLte: true,
      isGt: false,
      isGte: false,
    },
  });
});

it(`reads width and height value on exact`, async () => {
  const breakpoints = [
    { name: 'small', maxWidth: 600 },
    { name: 'large', minWidth: 1200, exact: true },
  ];
  const channel = testChannel();

  function Test() {
    const bp = useBreakpoint(breakpoints);

    return (
      <React.Fragment>
        <channel.Send>
          {
            {
              small: {
                isEq: bp.isEq('small'),
                isLt: bp.isLt('small'),
                isLte: bp.isLte('small'),
                isGt: bp.isGt('small'),
                isGte: bp.isGte('small'),
              },
              exact: {
                width: bp.width,
                height: bp.height,
              },
            }
          }
        </channel.Send>
      </React.Fragment>
    );
  }

  const { getByTestId } = render(<Test />);
  window.innerWidth = 1205;
  fireEvent(window, new Event('resize'));
  expect(channel.receive(getByTestId)).toEqual({
    small: {
      isEq: false,
      isLt: false,
      isLte: false,
      isGt: true,
      isGte: true,
    },
    exact: {
      width: 1205,
      height: 768,
    },
  });
});

