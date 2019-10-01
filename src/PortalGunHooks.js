// @flow
import * as React from 'react';

class Store {
  id = 100000;

  listeners = [];
  sourceIds = [];
  idsToNodes = {};

  increment() {
    this.id = this.id + 1;
  }

  addNodeAndPush(node) {
    this.sourceIds.push(this.id);
    this.idsToNodes[this.id] = node;
  }

  addListener(handler) {
    this.listeners.push(handler);
  }

  queueUpdate() {
    setTimeout(() => this.listeners.forEach(listener => listener()), 0);
  }
}

function SourceCmp({ children, store }) {
  store.increment();
  store.addNodeAndPush(children);

  React.useEffect(() => {
    store.queueUpdate();
  }, [children]);

  return null;
}

function DestCmp({ children, store }) {
  const [counter, setCounter] = React.useState(1);
  const listener = () => setCounter(counter + 1);

  React.useEffect(() => {
    store.addListener(listener);
  }, [counter]);

  return (
    store.sourceIds.map(id => (
      <React.Fragment key={id}>
        {typeof children === 'function' ? children(store.idsToNodes[id]) : store.idsToNodes[id]}
      </React.Fragment>
    ))
  );
}

function usePortalGun() {
  const store = new Store();

  const Source = props => SourceCmp({ ...props, store });
  const Dest = props => DestCmp({ ...props, store });

  return [Source, Dest];
}

export default usePortalGun;
