import * as React from 'react';
import { BreakpointHoc } from '../../Breakpoint.js';

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
      <div key={name}>
        <h2>{name}</h2>
        <table>
          <thead>
            <tr>
              <th>method</th>
              <th>value</th>
            </tr>
          </thead>
          <tbody>
            {keys.map(key => (
              <tr key={key}>
                <td>{key}</td>
                <td>{String(bp[key](name))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
    return <div>{results}</div>;
  };
  return BreakpointHoc({ breakpoints })(C);
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
