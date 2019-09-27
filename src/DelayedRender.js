/* eslint react/prop-types: 0 */
// @flow
import * as React from 'react';

function DelayedRender({ children, options }) {
  const hasRendered = React.useRef(false);
  const [, forceRender] = React.useState(false);

  React.useEffect(() => {
    if (options.idle) {
      return;
    }

    if (hasRendered.current) {
      hasRendered.current = false;
      forceRender(x => !x);
    }

    const timer = setTimeout(() => {
      hasRendered.current = true;
      forceRender(x => !x);
    }, options.timeout);

    return () => clearTimeout(timer);
  }, [options.timeout]);


  if (!hasRendered.current) return null;

  return children;
}

export default DelayedRender;
