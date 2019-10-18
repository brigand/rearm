/* eslint react/prop-types: 0 */
// @flow
import * as React from 'react';
import usePromise from './utils/usePromise';

class AsyncStore {
  constructor(result, error, state) {
    this.result = result;
    this._error = error;
    this.state = state;
  }

  value() {
    return this.result || null;
  }

  error() {
    return this._error || null;
  }

  success() {
    return this.state === 'resolved' ? this.value() : null;
  }

  failure() {
    return this.state === 'rejected' ? this.error() : null;
  }

  initial() {
    return this.state === 'initial';
  }

  loading() {
    return this.state === 'pending';
  }
}

function useAsync(promise, deps) {
  const [result, error, state] = usePromise(promise, deps);


  return new AsyncStore(result, error, state);
}


export default useAsync;
