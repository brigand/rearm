/* eslint react/prop-types: 0 */
// @flow
import * as React from 'react';

let rIC;

if (window.requestIdleCallback) {
  rIC = window.requestIdleCallback;
} else {
  rIC = (handler, { timeout }) => setTimeout(handler, timeout);
}

window.cancelIdleCallback = window.cancelIdleCallback || function clear(id) {
  clearTimeout(id);
};

function DeferredRender({ children, options }) {
  const [render, setRender] = React.useState(false);

  React.useEffect(() => {
    if (render) setRender(false);
    const id = rIC(() => setRender(true), { timeout: options.timeout });

    return () => cancelIdleCallback(id);
  }, [options.timeout]);

  if (!render) return null;

  return children;
}

export default DeferredRender;
