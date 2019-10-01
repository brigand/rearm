// @flow
import * as React from 'react';

class Store {
  static id = 100000;

  listeners = [];
  sourceIds = [];
  idsToNodes = {};

  addNode(node, id) {
    this.sourceIds.push(id);
    this.idsToNodes[id] = node;
  }

  deleteNode(id) {
    delete this.idsToNodes[id];
    this.sourceIds.splice(this.sourceIds.indexOf(id), 1);
    this.queueUpdate();
  }

  addListener(handler) {
    this.listeners.push(handler);
  }

  removeListener(handler) {
    this.listeners.splice(this.listeners.indexOf(handler), 1);
  }

  queueUpdate() {
    setTimeout(() => this.listeners.forEach(listener => listener()), 0);
  }
}

function SourceCmp({ children, store }) {
  const [id] = React.useState(() => Store.id + 1);

  React.useEffect(() => {
    store.addNode(children, id);
    store.queueUpdate();

    return () => store.deleteNode(id);
  }, [children]);

  return null;
}

function DestCmp({ children, store }) {
  const [counter, setCounter] = React.useState(1);
  const listener = () => setCounter(counter + 1);

  React.useEffect(() => {
    store.addListener(listener);

    return () => store.removeListener(listener);
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
