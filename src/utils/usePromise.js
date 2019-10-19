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
  pending: 'pending',
  rejected: 'rejected',
  resolved: 'resolved',
  initial: 'initial',
};

const INITIAL_PENDING = {
  error: undefined,
  result: undefined,
  state: states.pending,
  lastValue: null,
};

function reducer(state, action) {
  switch (action.type) {
    case states.resolved:
      return {
        error: undefined,
        result: action.payload,
        state: states.resolved,
        lastValue: { inner: action.payload },
      };
    case states.rejected:
      return {
        error: action.payload,
        result: undefined,
        state: states.rejected,
        lastValue: state.lastValue,
      };
    case states.pending:
      return {
        error: undefined,
        result: undefined,
        state: states.pending,
        lastValue: state.lastValue,
      };

    case states.initial:
      return {
        error: null,
        result: null,
        state: states.initial,
        lastValue: null,
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
    lastValue,
  }, dispatch] = React.useReducer(reducer, INITIAL_PENDING);

  const isFirstRun = React.useRef(true);

  React.useEffect(() => {
    promise = resolvePromise(promise);
    let canceled = false;

    if (!isFirstRun.current) {
      dispatch({ type: states.pending });
    }

    if (!promise) {
      dispatch({ type: states.initial });
      return;
    }

    promise.then(
      (res) => {
        isFirstRun.current = false;

        if (!canceled) {
          dispatch({ payload: res, type: states.resolved });
        }
      },
      (err) => {
        isFirstRun.current = false;

        if (!canceled) {
          dispatch({ payload: err, type: states.rejected });
        }
      },
    );

    return () => (canceled = true);
  }, deps);

  return [result, error, state, lastValue];
}

export default usePromise;
