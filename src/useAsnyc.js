/* eslint react/prop-types: 0 */
// @flow
import * as React from 'react';
import usePromise from './utils/usePromise';

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

  hasError() {
    return this._error != null;
  }

  isLoading() {
    return this._state === 'loading';
  }

  isSuccess() {
    return this._state === 'success';
  }

  isFailure() {
    return this._state === 'failure';
  }

  isInitial() {
    return this._state === 'initial';
  }

  value() {
    return this._latestValue ? this._latestValue.inner : undefined;
  }

  error() {
    return this._error ? this._error : undefined;
  }

  success() {
    return this.isSuccess() ? this.value() : null;
  }

  failure() {
    return this.isFailure() ? this.error() : null;
  }

  initial() {
    return this.isInitial();
  }

  loading() {
    return this.isLoading();
  }

  match(matcher) {
    for (const key of Object.keys(matcher)) {
      if (key === 'value') {
        if (this.hasValue()) {
          return matcher.value(this.value());
        }
      }

      if (key === 'error') {
        if (this.hasError()) {
          return matcher.error(this.error());
        }
      }

      if (key === 'loading') {
        if (this.isLoading()) {
          return matcher.loading();
        }
      }

      if (key === 'success') {
        if (this.isSuccess()) {
          return matcher.success(this.value());
        }
      }

      if (key === 'failure') {
        if (this.isFailure()) {
          return matcher.failure(this.error());
        }
      }

      if (key === 'initial') {
        if (this.isInitial()) {
          return matcher.initial();
        }
      }
    }
  }
}


function useAsync(promise, deps) {
  const [result, error, state, latestValue] = usePromise(promise, deps);

  return new AsyncStore(result, error, state, latestValue);
}


export default useAsync;
