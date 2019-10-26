/* eslint react/prop-types: 0 */
import * as React from 'react';

type Nothing = null | void;
export type PromiseNullable<T> = Promise<T> | Nothing;
export type PromiseArg<T> = PromiseNullable<T> | (() => PromiseNullable<T>);

function resolvePromise<T>(promise: PromiseArg<T>): PromiseNullable<T> {
  if (typeof promise === 'function') {
    return promise();
  }

  return promise;
}

enum State {
  loading = 'loading',
  error = 'error',
  success = 'success',
  initial = 'initial',
}

const INITIAL_LOADING = {
  error: undefined,
  result: undefined,
  state: State.loading,
  latestValue: null,
};

type Latest<T> = null | { inner: T };

type ReducerState<T, E> = {
  state: State;
  error: E | void;
  result: T | void;
  latestValue: Latest<T>;
};

type Action<T, E> =
  | {
      type: State.loading | State.initial;
    }
  | {
      type: State.success;
      payload: T;
    }
  | {
      type: State.error;
      payload: E;
    };

function reducer<T, E>(
  state: ReducerState<T, E>,
  action: Action<T, E>,
): ReducerState<T, E> {
  switch (action.type) {
    case State.success:
      return {
        error: undefined,
        result: action.payload,
        state: State.success,
        latestValue: { inner: action.payload },
      };
    case State.error:
      return {
        error: action.payload,
        result: undefined,
        state: State.error,
        latestValue: state.latestValue,
      };
    case State.loading:
      return {
        error: undefined,
        result: undefined,
        state: State.loading,
        latestValue: state.latestValue,
      };

    case State.initial:
      return {
        error: undefined,
        result: undefined,
        state: State.initial,
        latestValue: null,
      };
    default:
      return state;
  }
}

function usePromise<T, E>(_promise: PromiseArg<T>, deps: Array<unknown>) {
  let promise = _promise;
  const [{ result, error, state, latestValue }, dispatch] = React.useReducer(
    reducer,
    INITIAL_LOADING,
  );

  const isFirstRun = React.useRef(true);

  React.useEffect(() => {
    promise = resolvePromise(promise);
    let canceled = false;

    if (!isFirstRun.current) {
      dispatch({ type: State.loading });
    }

    if (!promise) {
      dispatch({ type: State.initial });
    } else if (state !== State.loading) {
      dispatch({ type: State.loading });
    }

    if (promise && typeof promise.then === 'function') {
      promise.then(
        (res: T) => {
          isFirstRun.current = false;

          if (!canceled) {
            dispatch({ payload: res, type: State.success });
          }
        },
        (err: E) => {
          isFirstRun.current = false;

          if (!canceled) {
            dispatch({ payload: err, type: State.error });
          }
        },
      );
    }

    return () => {
      canceled = true;
    };
  }, deps);

  return [result, error, state, latestValue];
}

export default usePromise;
