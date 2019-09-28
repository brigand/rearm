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
      const id = requestAnimationFrame(() => requestAnimationFrame(handler));
      return () => cancelAnimationFrame(id);
    };
  }

  return rIC;
}

const rIC = createRIC();

function DeferredRender({ children, options }) {
  const [render, setRender] = React.useState(false);

  React.useEffect(() => {
    if (render) setRender(false);
    const cancel = rIC(() => setRender(true), { timeout: options.idleTimeout });

    return cancel;
  }, [options.idleTimeout]);

  if (!render) return null;

  return children;
}


export default DeferredRender;
