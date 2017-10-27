import * as React from 'react';
import PropTypes from 'prop-types';
import md from '../md';
import { BreakpointHoc, BreakpointRender } from '../../Breakpoint.js';
import './DocsBreakpoint.css';

class TextHighlightTransition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flashing: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.setState({ flashing: true });
      setTimeout(() => this.setState({ flashing: false }), 1000);
    }
  }
  render() {
    const style = { transition: 'background 0.23s' };
    if (this.state.flashing) style.background = '#a0ffa9';
    return <span style={style}>{this.props.children}</span>;
  }
}
TextHighlightTransition.propTypes = { children: PropTypes.node.isRequired };

const DemoOne = (() => {
  const breakpoints = [
    { name: 'small', maxWidth: 600 },
    { name: 'medium', minWidth: 'small', maxWidth: 'large' },
    { name: 'large', minWidth: 1200 },
  ];

  // eslint-disable-next-line
  const C = ({ bp }) => {
    const keys = ['isLt', 'isLte', 'isGt', 'isGte', 'isEq'];
    const results = breakpoints.map(({ name }) => (
      <div key={name} className="DocsBreakpoint__DemoOneGroup">
        {keys.map(key => (
          <div key={key}>
            <code className="DocsBreakpoint__DemoOneMethod">{`${key}('${name}')`}</code>
            <span><TextHighlightTransition>{String(bp[key](name))}</TextHighlightTransition></span>
          </div>
        ))}
      </div>
    ));
    return <div>{results}</div>;
  };
  return BreakpointHoc({ breakpoints, type: 'viewport' })(C);
})();

const DemoTwo = (() => {
  const breakpoints = [
    { name: 'small', maxWidth: 600 },
    { name: 'medium', minWidth: 'small', maxWidth: 'large' },
    { name: 'large', minWidth: 1200 },
  ];

  const getClass = (yes: boolean) => (yes ? `DocsBreakpoint__DemoTwoItemYes` : null);
  return () => (
    <div className="DocsBreakpoint__DemoTwo">
      <BreakpointRender breakpoints={breakpoints} type="viewport">
        {bp => (
          <ul>
            <li className={getClass(bp.isEq('small'))}>Equal to small? {String(bp.isEq('small'))}</li>
            <li className={getClass(bp.isEq('medium'))}>Equal to medium? {String(bp.isEq('medium'))}</li>
            <li className={getClass(bp.isEq('large'))}>Equal to large? {String(bp.isEq('large'))}</li>
          </ul>
        )}
      </BreakpointRender>
    </div>
  );
})();

export default class DocsBreakpoint extends React.Component {
  render() {
    return (
      <div>
        {md`
          # Breakpoint

          The ||Breakpoint|| module provides information about the current viewport size,
          or the size of a specific element. It watches for changes to either of these,
          and renders your component with new props.

          ## Status: Partial

          Currently only viewport breakpoints are supported. The notes about element breakpoints
          will eventually be true.

          ## Why?

          Managing breakpoints from JS gives you full control over the view. You
          can render totally different components for different sizes. Additionally,
          you can pass a breakpoint object to child components without them knowing
          what the actual numbers are; only the names of each breakpoint.

          This module can also do breakpoints on any element in the DOM; it's
          not restricted to ||window||. This means your component doesn't have to
          assume it'll be used in any specific container. The component's concern is
          that it renders appropriately for the space it's given.

          ## Usage

          With the high order component variant, you receive one prop which is the 'bp'
          object. It has methods such as ||props.bp.isGte('medium')||.

          With the render callback variant, you receive 'bp' as the first argument to the function.

          They can be imported like this:

          ||||js
          import { BreakpointHoc } from 'rearm/lib/Breakpoint';

          // or the render variant
          import { BreakpointRender } from 'rearm/lib/Breakpoint';
          ||||

          You configure it by providing an array of breakpoint objects containing constraints.

          If you don't provide ||minWidth||, it defaults to ||0||. If you don't proivide ||maxWidth||,
          it defaults to ||Infinity||.

          ||||js
          const MyComponent = ({ bp }) => (
            bp.isLt('medium') ? <MobileView /> : <DesktopView />
          );
          const breakpoints = [
            { name: 'small', maxWidth: 600 },
            { name: 'medium', minWidth: 601, maxWidth: 1199 },
            { name: 'large', minWidth: 1200 },
          ];
          export default BreakpointHoc({ breakpoints, type: 'viewport' });
          ||||

          Or use the render callback variant:

          ||||js
          const MyComponent = () => (
            <BreakpointRender breakpoints={breakpoints} type="viewport">
              {bp => bp.isLt('medium') ? <MobileView /> : <DesktopView />}
            </BreakpointRender>
          );
          export default MyComponent;
          ||||

          Here are the outputs of all of the ||bp|| methods given these breakpoints.
          If you resize your browser, they will change.
        `}
        <DemoOne />
        {md`
          In the previous example we hard coded the ||minWidth|| of medium to be
          one pixel more than the ||maxWidth|| of small. This works, but it's more
          expressive to name the breakpoint you want to base the property on.

          In this code, 'medium' sets its ||minWidth|| based on 'small'. When you
          reference another breakpoint, the key is inverted.

          So the ||minWidth|| of 'medium'
          becomes the ||maxWidth|| of 'small', plus one.

          The ||maxWidth|| of 'medium' becomes
          the ||minWidth|| of 'large', minus one.

          ||||js
          const breakpoints = [
            { name: 'small', maxWidth: 600 },
            { name: 'medium', minWidth: 'small', maxWidth: 'large' },
            { name: 'large', minWidth: 1200 },
          ];
          ||||
        `}
        {md`
          The render variant is similar, but can be used more easily in some
          situations. We'll use this code (styles omitted for brevity):

          ||||js
          <BreakpointRender breakpoints={breakpoints} type="viewport">
            {bp => (
              <div>
                <dl>
                  <dt>Equal to small? {String(bp.isEq('small'))}</dt>
                  <dt>Equal to medium? {String(bp.isEq('medium'))}</dt>
                  <dt>Equal to large? {String(bp.isEq('large'))}</dt>
                </dl>
              </div>
            )}
          </BreakpointRender>
          ||||

          Which produces this output:
        `}
        <DemoTwo />
      </div>
    );
  }
}
