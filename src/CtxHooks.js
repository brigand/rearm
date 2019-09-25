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

  getState() {
    return this.state;
  }
}

function createUseSelector(Context) {
  return function useSelector(selector) {
    const store = React.useContext(Context);
    const [, forceUpdate] = React.useState(0);
    let selectedState;

    React.useEffect(() => {
      const unsub = store.subscribe(selector);
      forceUpdate(x => !x);
      // detach when unmount
      return () => unsub();
    }, [store]);

    selectedState = selector(store.getState());

    return selectedState;
  };
}

function makeCtx() {
  const store = new CtxStore();
  const Context = React.createContext();

  return {
    provider: function CtxComponent({ set, children }) {
      React.useEffect(() => {
        store.replaceStateAndNotify(set);
      }, [set]);

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
