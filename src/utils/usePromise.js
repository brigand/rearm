/* eslint react/prop-types: 0 */
// @flow
import * as React from 'react';

function resolvePromise(promise) {
  if (typeof promise === 'function') {
    return promise();
  }

  return promise;
}

const states = {
  loading: 'loading',
  error: 'error',
  success: 'success',
  initial: 'initial',
};

const INITIAL_LOADING = {
  error: undefined,
  result: undefined,
  state: states.loading,
  latestValue: null,
};

function reducer(state, action) {
  switch (action.type) {
    case states.success:
      return {
        error: undefined,
        result: action.payload,
        state: states.success,
        latestValue: { inner: action.payload },
      };
    case states.error:
      return {
        error: action.payload,
        result: undefined,
        state: states.error,
        latestValue: state.latestValue,
      };
    case states.loading:
      return {
        error: undefined,
        result: undefined,
        state: states.loading,
        latestValue: state.latestValue,
      };

    case states.initial:
      return {
        error: null,
        result: null,
        state: states.initial,
        latestValue: null,
      };
    default:
      return state;
  }
}

function usePromise(_promise, deps) {
  let promise = _promise;
  const [{
    result,
    error,
    state,
    latestValue,
  }, dispatch] = React.useReducer(reducer, INITIAL_LOADING);

  const isFirstRun = React.useRef(true);

  React.useEffect(() => {
    promise = resolvePromise(promise);
    let canceled = false;

    if (!isFirstRun.current) {
      dispatch({ type: states.loading });
    }

    if (!promise) {
      dispatch({ type: states.initial });
    } else if (state !== states.loading) {
      dispatch({ type: states.loading });
    }

    promise.then(
      (res) => {
        isFirstRun.current = false;

        if (!canceled) {
          dispatch({ payload: res, type: states.success });
        }
      },
      (err) => {
        isFirstRun.current = false;

        if (!canceled) {
          dispatch({ payload: err, type: states.error });
        }
      },
    );

    return () => { canceled = true; };
  }, deps);

  return [result, error, state, latestValue];
}

export default usePromise;
