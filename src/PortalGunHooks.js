// @flow
import * as React from 'react';

class Store {
  static id = 100000;

  listeners = [];
  idsToNodes = new Map();

  addNode(id, node) {
    this.idsToNodes.set(id, node);
  }

  deleteNode(id) {
    this.idsToNodes.delete(id);
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

const useId = () => {
  const ref = React.useRef();
  if (!ref.current) {
    Store.id += 1;
    ref.current = Store.id;
  }
  return ref.current;
};

function SourceCmp({ children, store }) {
  const id = useId();

  store.addNode(id, children);
  React.useEffect(() => store.queueUpdate(), [children]);

  React.useEffect(() => {
    return () => store.deleteNode(id);
  }, []);

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
    Array.from(store.idsToNodes.keys()).map(id => (
      <React.Fragment key={id}>
        {typeof children === 'function' ? children(store.idsToNodes.get(id)) : store.idsToNodes.get(id)}
      </React.Fragment>
    ))
  );
}

function usePortalGun() {
  const { Source, Dest } = React.useMemo(() => {
    const store = new Store();
    const Source = props => SourceCmp({ ...props, store });
    const Dest = props => DestCmp({ ...props, store });

    return { Source, Dest };
  }, []);


  return [Source, Dest];
}

export default usePortalGun;
