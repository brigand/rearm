/* eslint react/prop-types: 0 */
// @flow
import * as React from 'react';
import usePromise from './utils/usePromise';

class AsyncStore {
  constructor(result, error, state, lastValue) {
    this._result = result;
    this._error = error;
    this._state = state;
    this.lastValue = lastValue;
  }

  value() {
    return this._result || null;
  }

  error() {
    return this._error || null;
  }

  success() {
    return this._state === 'resolved' ? this.value() : null;
  }

  failure() {
    return this._state === 'rejected' ? this.error() : null;
  }

  initial() {
    return this._state === 'initial';
  }

  loading() {
    return this._state === 'pending';
  }
}


function useAsync(promise, deps) {
  const [result, error, state, lastValue] = usePromise(promise, deps);

  return new AsyncStore(result, error, state, lastValue);
}


export default useAsync;
