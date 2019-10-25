/* eslint react/prop-types: 0 */
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import '@babel/polyfill';
import { render, waitForDomChange, fireEvent, act } from '@testing-library/react';
import useAsync from '../useAsync';

function DisplayState({ api }) {
  const result = {
    value: api.value(),
    success: api.success(),
    error: api.error(),
    initial: api.initial(),
    loading: api.loading(),

    hasValue: api.hasValue(),
    isSuccess: api.isSuccess(),
    isLoading: api.isLoading(),
    isError: api.isError(),
    isInitial: api.isInitial(),

    matches: api.match({
      default: () => ({ type: 'default' }),
      loading: () => ({ type: 'loading' }),
      success: value => ({ type: 'success', value }),
      error: msg => ({ type: 'error', value: msg }),
    }),
  };

  return (
    <div data-testid="state">
      {JSON.stringify(result)}
    </div>
  );
}

function getStates(getByTestId) {
  return JSON.parse(getByTestId('state').textContent);
}

it(`matches only loading`, () => {
  const neverResolves = () => new Promise(() => {});

  function Test() {
    const api = useAsync(() => neverResolves(), []);
    return <DisplayState api={api} />;
  }

  const { getByTestId } = render(<Test />);
  expect(getStates(getByTestId)).toEqual({
    value: undefined,
    success: null,
    error: null,
    initial: false,
    loading: true,

    hasValue: false,
    isSuccess: false,
    isLoading: true,
    isError: false,
    isInitial: false,

    matches: { type: 'loading' },
  });
});

it(`resolves to success`, async () => {
  const resolves = () => new Promise(resolve => resolve(1));

  function Test() {
    const api = useAsync(() => resolves(), []);
    return <DisplayState api={api} />;
  }

  const { getByTestId } = render(<Test />);
  await waitForDomChange();
  expect(getStates(getByTestId)).toEqual({
    value: 1,
    success: 1,
    error: null,
    initial: false,
    loading: false,

    hasValue: true,
    isSuccess: true,
    isLoading: false,
    isError: false,
    isInitial: false,

    matches: { type: 'success', value: 1 },
  });
});

it(`rejects to error`, async () => {
  const error = { message: 'Expected rejection' };
  const rejects = () => new Promise((_, reject) => reject(error));

  function Test() {
    const api = useAsync(() => rejects(), []);
    return <DisplayState api={api} />;
  }

  const { getByTestId } = render(<Test />);
  await waitForDomChange();
  expect(getStates(getByTestId)).toEqual({
    value: undefined,
    success: null,
    error,
    initial: false,
    loading: false,

    hasValue: false,
    isSuccess: false,
    isLoading: false,
    isError: true,
    isInitial: false,

    matches: { type: 'error', value: error },
  });
});

it(`goes from success to loading`, async () => {
  const resolves = () => new Promise(resolve => resolve(1));

  function Test() {
    const [counter, setCounter] = React.useState(1);
    const api = useAsync(() => resolves(), [counter]);

    return (
      <React.Fragment>
        <button data-testid="incr" onClick={() => setCounter(c => c + 1)}>Incr</button>
        <DisplayState api={api} />
      </React.Fragment>
    );
  }

  const { getByTestId } = render(<Test />);
  const button = getByTestId('incr');

  await waitForDomChange();
  expect(getStates(getByTestId)).toMatchObject({
    value: 1,
    hasValue: true,
    success: 1,
    isLoading: false,
    matches: { type: 'success', value: 1 },
  });
  act(() => fireEvent.click(button));
  expect(getStates(getByTestId)).toMatchObject({
    value: 1,
    hasValue: true,
    success: null,
    isLoading: true,
    matches: { type: 'loading' },
  });
});

