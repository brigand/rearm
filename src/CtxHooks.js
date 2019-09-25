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

  replaceStateAndNotify(newState: any) {
    this.state = newState;
    this.subs.forEach(sub => sub());
  }
}

function createUseSelector(Context) {
  return function useSelector(selector) {
    const store = React.useContext(Context);
    const [, forceUpdate] = React.useState(false);

    const prevState = React.useRef();

    React.useEffect(() => {
      const unsub = store.subscribe((state) => {
        const newState = selector(state);

        if (newState !== prevState.current) {
          prevState.current = newState;
          forceUpdate(x => !x);
        }
      });

      // detach when unmount
      return () => unsub();
    }, [selector]);

    prevState.current = selector(store.state);

    return prevState.current;
  };
}

function makeCtx() {
  const store = new CtxStore();
  const Context = React.createContext();

  return {
    Provider: function CtxComponent({ value, children }) {
      React.useEffect(() => {
        store.replaceStateAndNotify(value);
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
