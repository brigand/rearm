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

const STATE_PENDING = {
  error: undefined,
  result: undefined,
  state: states.pending,
};

function reducer(state, action) {
  switch (action.type) {
    case states.resolved:
      return {
        error: undefined,
        result: action.payload,
        state: states.resolved,
      };
    case states.rejected:
      return {
        error: action.payload,
        result: undefined,
        state: states.rejected,
      };
    case states.pending:
      return STATE_PENDING;

    case states.initial:
      return {
        error: null,
        result: null,
        state: states.initial,
      };
    default:
      return state;
  }
}

function usePromise(_promise, deps) {
  let promise = _promise;
  const [{ result, error, state }, dispatch] = React.useReducer(reducer, STATE_PENDING);

  React.useEffect(() => {
    promise = resolvePromise(promise);
    let canceled = false;

    dispatch({ type: states.pending });

    if (!promise) {
      dispatch({ type: states.initial });
      return;
    }

    promise.then(
      res => !canceled && dispatch({ payload: res, type: states.resolved }),
      err => !canceled && dispatch({ payload: err, type: states.rejected }),
    );

    return () => { canceled = true; };
  }, deps);


  return [result, error, state];
}

export default usePromise;
