import * as React from 'react';
import styled from 'styled-components';
import { BreakpointHoc } from '../../Breakpoint';

const Text = styled.span`
  transition: background 0.23s;
  background: ${props => (props.active ? '#a0ffa9' : 'transparent')};
`;

const breakpoints = [
  { name: 'small', maxWidth: 600 },
  { name: 'medium', minWidth: 'small', maxWidth: 'large' },
  { name: 'large', minWidth: 1200, exact: true },
];

const keys = ['isLt', 'isLte', 'isGt', 'isGte', 'isEq'];

function Highlight({ children }) {
  const [isFlashing, setFlashing] = React.useState(false);
  const initialMount = React.useRef(true);

  React.useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
    } else {
      setFlashing(true);
      setTimeout(() => setFlashing(false), 1000);
    }
  }, [children]);

  return <Text active={isFlashing}>{children}</Text>;
}

function BreakpointMethods({ bp }) {
  const results = breakpoints.map(({ name }) => (
    <div key={name}>
      {keys.map(key => (
        <div key={key}>
          <code>{`${key}('${name}') === `}</code>
          <Highlight>{String(bp[key](name))}</Highlight>
        </div>
      ))}
    </div>
  ));

  return (
    <div>
      {results}
      <pre>bp.width: <Highlight>{bp.width()}</Highlight>, bp.height: <Highlight>{bp.height()}</Highlight></pre>
    </div>
  );
}

export default BreakpointHoc({ breakpoints, type: 'viewport' })(BreakpointMethods);
