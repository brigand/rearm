/* eslint react/prop-types: 0 */
// @flow
import * as React from 'react';
import usePromise from './utils/usePromise';

const states = {
  value: 'value',
  error: 'error',
  loading: 'loading',
  initial: 'initial',
  default: 'default',
};

const keyExists = k => (k in states);

class AsyncStore {
  constructor(result, error, state, latestValue) {
    this._result = result;
    this._error = error;
    this._state = state;
    this._latestValue = latestValue;
  }

  hasValue() {
    return this._latestValue != null;
  }

  isLoading() {
    return this._state === 'loading';
  }

  isSuccess() {
    return this._state === 'success';
  }

  isError() {
    return this._state === 'error';
  }

  isInitial() {
    return this._state === 'initial';
  }

  value() {
    return this._latestValue ? this._latestValue.inner : undefined;
  }

  success() {
    return this.isSuccess() ? this.value() : null;
  }

  error() {
    return this.isError() ? this._error : null;
  }

  initial() {
    return this.isInitial();
  }

  loading() {
    return this.isLoading();
  }

  match(matcher) {
    for (const key of Object.keys(matcher)) {
      if (key === states.value) {
        if (this.hasValue()) {
          return matcher.value(this.value());
        }
      }

      if (key === states.error) {
        if (this.isError()) {
          return matcher.error(this.error());
        }
      }

      if (key === states.loading) {
        if (this.isLoading()) {
          return matcher.loading();
        }
      }

      if (key === states.success) {
        if (this.isSuccess()) {
          return matcher.success(this.value());
        }
      }

      if (key === states.initial) {
        if (this.isInitial()) {
          return matcher.initial();
        }
      }

      if (!keyExists(key)) {
        throw new Error(`Unexpected matcher key "${key}". See the expected API`);
      }
    }

    if (matcher.default) {
      return matcher.default();
    }

    throw new Error(`No cases matched. Define a 'default' case as a fallback if needed.`);
  }
}


function useAsync(promise, deps) {
  const [result, error, state, latestValue] = usePromise(promise, deps);

  return new AsyncStore(result, error, state, latestValue);
}

export default useAsync;
