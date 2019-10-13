import * as React from 'react';

function UpdateCounter() {
  const updates = React.useRef(-1);
  updates.current += 1;
  return <div>Updates: {updates.current}</div>;
}
