import * as React from 'react';
import { BreakpointHoc } from '../../Breakpoint.js';
import './DocsBreakpoint.css';

const DemoOne = (() => {
  const breakpoints = [
    { name: 'small', maxWidth: 600 },
    { name: 'medium', minWidth: 'small', maxWidth: 1000 },
    { name: 'large', minWidth: 'medium', maxWidth: 1450 },
    { name: 'xlarge', minWidth: 'large' },
  ];

  // eslint-disable-next-line
  const C = ({ bp }) => {
    const keys = ['isLt', 'isLte', 'isGt', 'isGte', 'isEq'];
    const results = breakpoints.map(({ name }) => (
      <div key={name} className="DocsBreakpoint__DemoOneGroup">
        {keys.map(key => (
          <div key={key}>
            <code className="DocsBreakpoint__DemoOneMethod">{`${key}('${name}')`}</code>
            <span>{String(bp[key](name))}</span>
          </div>
        ))}
      </div>
    ));
    return <div>{results}</div>;
  };
  return BreakpointHoc({ breakpoints, type: 'viewport' })(C);
})();

export default class DocsBreakpoint extends React.Component {
  render() {
    return (
      <div>
        <h1>Breakpoint</h1>
        <DemoOne />
      </div>
    );
  }
}
