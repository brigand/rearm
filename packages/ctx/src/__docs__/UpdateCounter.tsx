import * as React from 'react';

function UpdateCounter(props: {}) {
  const updates = React.useRef(-1);
  updates.current += 1;
  return <div className="update-counter">Updates: {updates.current}</div>;
}

export default UpdateCounter;
