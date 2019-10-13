/* eslint react/prop-types: 0 */
import * as React from 'react';

type Sub = () => void;
type Handler<T> = (state: T) => void;

class CtxStore<T> {
  state: T | void = undefined;
  subs: Array<Sub> = [];

  subscribe(handler: Handler<T>) {
    const sub = () => {
      if (this.state !== undefined) {
        handler(this.state);
      }
    };

    this.subs.push(sub);

    const unsubscribe = () => {
      const index = this.subs.indexOf(sub);

      if (index !== -1) {
        this.subs.splice(index, 1);
      }
    };

    return unsubscribe;
  }

  replaceState(newState: any) {
    this.state = newState;
  }

  notifyAll() {
    this.subs.forEach((sub) => sub());
  }
}

export type Selector<T, U> = ((state: T) => U);

interface UseSelector<T> {
  (): T;
  <U>(selector: Selector<T, U>): U;
  <U>(selector: Selector<T, U> | void): T | U;
}

export type ProviderProps<T> = { value: T; children: React.ReactChild };
export type Ctx<T> = {
  Provider: React.SFC<ProviderProps<T>>;
  use: UseSelector<T>;
};

function makeCtx<T>(): Ctx<T> {
  const Context: React.Context<CtxStore<T>> = React.createContext(new CtxStore());

  function useSelector(): T;
  function useSelector<U>(selector: Selector<T, U>): U;
  function useSelector<U>(selector: Selector<T, U> | void = undefined) {
    const store: CtxStore<T> = React.useContext(Context);
    const [, forceUpdate] = React.useState(false);

    const compute = (state: T) => {
      if (selector === undefined && typeof selector !== 'function') {
        return state;
      } else if (typeof selector === 'function') {
        return selector(state);
      } else {
        throw new Error('Expected the selector to be a function or null/undefined');
      }
    };

    if (store.state === undefined) {
      throw new Error(`useSelector must be used in a child of the provider`);
    }

    const prevState = React.useRef(compute(store.state));

    React.useEffect(
      () => {
        const unsub = store.subscribe((state: T) => {
          const result = compute(state);
          if (result !== prevState.current) {
            prevState.current = result;
            forceUpdate((x) => !x);
          }
        });

        // detach when unmount
        return unsub;
      },
      [selector],
    );

    return prevState.current;
  }

  return {
    Provider: function CtxProvider({ value, children }: ProviderProps<T>) {
      if (typeof children === 'function')
        throw new Error("The 'children' prop cannot be a function");

      const store: CtxStore<T> = React.useMemo(() => new CtxStore(), []);
      store.state = value;

      React.useEffect(
        () => {
          store.notifyAll();
        },
        [value],
      );

      return <Context.Provider value={store}>{children}</Context.Provider>;
    },
    use: useSelector,
  };
}

export { makeCtx };
