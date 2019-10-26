import usePromise, { State, Latest, PromiseArg } from './internal/use-promise';

enum Variant {
  value = 'value',
  success = 'success',
  error = 'error',
  loading = 'loading',
  initial = 'initial',
  default = 'default',
}

const keyExists = (k: string) => k in Variant;

type Matcher<T, E, R> = Partial<{
  value: (value: T) => R;
  success: (value: T) => R;
  error: (error: E) => R;
  loading: () => R;
  initial: () => R;
  default: () => R;
}>;

class AsyncStore<T, E> {
  constructor(
    private _result: T | void,
    private _error: E | void,
    private _state: State,
    private _latestValue: Latest<T>,
  ) {}

  hasValue() {
    return this._latestValue != null;
  }

  isLoading() {
    return this._state === State.loading;
  }

  isSuccess() {
    return this._state === State.success;
  }

  isError() {
    return this._state === State.error;
  }

  isInitial() {
    return this._state === State.initial;
  }

  value() {
    return this._latestValue ? this._latestValue.inner : undefined;
  }

  success() {
    return this.isSuccess() ? this._result : null;
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

  match<R>(matcher: Matcher<T, E, R>) {
    const callValue = (variant: Variant): R =>
      (matcher as any)[variant](this.value() as T);
    const callError = (variant: Variant): R =>
      (matcher as any)[variant](this.error() as E);
    const callNoArg = (variant: Variant): R => (matcher as any)[variant]();

    for (const key of Object.keys(matcher)) {
      if (key === Variant.value) {
        if (this.hasValue()) {
          return callValue(key);
        }
      }

      if (key === Variant.error) {
        if (this.isError()) {
          return callError(key);
        }
      }

      if (key === Variant.loading) {
        if (this.isLoading()) {
          return callNoArg(key);
        }
      }

      if (key === Variant.success) {
        if (this.isSuccess()) {
          return callValue(key);
        }
      }

      if (key === Variant.initial) {
        if (this.isInitial()) {
          return callNoArg(key);
        }
      }

      if (!keyExists(key)) {
        throw new Error(`Unexpected matcher key "${key}". See the expected API`);
      }
    }

    if (matcher.default) {
      return matcher.default();
    }

    throw new Error(
      `No cases matched. Define a 'default' case as a fallback if needed.`,
    );
  }
}

function useAsync<T, E>(
  promise: PromiseArg<T>,
  deps: Array<unknown>,
): AsyncStore<T, E> {
  const [result, error, state, latestValue] = usePromise(promise, deps);

  return new AsyncStore(result, error, state, latestValue);
}

export default useAsync;
