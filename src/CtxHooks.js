/* eslint react/prop-types: 0 */
// @flow
import * as React from 'react';

class CtxStore {
  state = {}
  subs = [];

  subscribe(handler: Function) {
    const wrapper = () => {
      handler(this.state);
    };

    this.subs.push(wrapper);

    const unsub = () => {
      const index = this.subs.indexOf(handler);

      if (index !== -1) {
        this.subs.splice(index, 1);
      }
    };

    return unsub;
  }

  replaceState(newState: any) {
    this.state = newState;
  }

  notifyAll() {
    this.subs.forEach(sub => sub());
  }
}

function execSelector(value, selector) {
  if (typeof selector === 'function') {
    return selector(value);
  } else if (selector === null || selector === undefined) {
    return value;
  } else {
    throw new Error('Expected the selector to be a function or null/undefined');
  }
}

function createUseSelector(Context) {
  return function useSelector(selector) {
    const store = React.useContext(Context);
    const [, forceUpdate] = React.useState(false);

    const prevState = React.useRef();

    React.useEffect(() => {
      const unsub = store.subscribe((state) => {
        const newState = execSelector(state, selector);

        if (newState !== prevState.current) {
          prevState.current = newState;
          forceUpdate(x => !x);
        }
      });

      // detach when unmount
      return unsub();
    }, [selector]);

    prevState.current = execSelector(store.state, selector);

    return prevState.current;
  };
}

function makeCtx() {
  const Context = React.createContext();

  return {
    Provider: function CtxProvider({ value, children }) {
      if (typeof children === 'function') throw new Error("The 'children' prop cannot be a function");

      const store = React.useMemo(() => new CtxStore(), []);
      store.state = value;

      React.useEffect(() => {
        store.notifyAll();
      }, [value]);

      return (
        <Context.Provider value={store}>
          { children }
        </Context.Provider>
      );
    },
    use: createUseSelector(Context),
  };
}


export { makeCtx };
