/* eslint react/prop-types: 0 */
// @flow
import * as React from 'react';

function createRIC() {
  let rIC;

  if (window.requestIdleCallback) {
    rIC = (handler, options) => {
      const id = requestIdleCallback(handler, options);
      return () => cancelIdleCallback(id);
    };
  } else {
    rIC = (handler) => {
      let id;

      id = requestAnimationFrame(() => {
        id = requestAnimationFrame(handler);
      });

      return () => cancelAnimationFrame(id);
    };
  }

  return rIC;
}

function useDeferredRender({ idleTimeout }) {
  const rIC = createRIC();

  return {
    DeferredRender: function DeferredRender({ children }) {
      const [render, setRender] = React.useState(false);

      React.useEffect(() => {
        if (render) setRender(false);
        const cancel = rIC(() => setRender(true), { timeout: idleTimeout });

        return cancel;
      }, [idleTimeout]);

      if (!render) return null;

      return children;
    },
  };
}

export default useDeferredRender;
