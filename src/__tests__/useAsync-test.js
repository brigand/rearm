/* eslint react/prop-types: 0 */
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import '@babel/polyfill';
import { render, waitForDomChange } from '@testing-library/react';
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
      error: msg => ({ type: 'error', msg }),
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
  expect(getStates(getByTestId).matches).toMatchObject({ type: 'loading' });
});

it(`matches only success`, async () => {
  const resolves = () => new Promise(resolve => resolve(1));

  function Test() {
    const api = useAsync(() => resolves(), []);
    return <DisplayState api={api} />;
  }

  const { getByTestId } = render(<Test />);
  await waitForDomChange();
  expect(getStates(getByTestId).matches).toMatchObject({ type: 'success', value: 1 });
});

