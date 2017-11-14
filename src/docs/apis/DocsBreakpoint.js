import * as React from 'react';
import PropTypes from 'prop-types';
import md from '../md';
import { BreakpointHoc, BreakpointRender } from '../../Breakpoint.js';
import './DocsBreakpoint.css';

class TextHighlightTransition extends React.PureComponent {
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

const DemoElementBp = (() => {
  const breakpoints = [
    { name: 'small', maxWidth: 300 },
    { name: 'medium', minWidth: 'small', maxWidth: 600 },
    { name: 'large', minWidth: 'medium' },
  ];

  const className = `DocsBreakpoint__DemoElementBp`;
  return () => (
    <div>
      <BreakpointRender breakpoints={breakpoints} type="element" element=":parent:">
        {bp => (
          <div className="DocsBreakpoint__DemoElementBp__Inner">
            {bp.isEq('small') && 'small'}
            {bp.isEq('medium') && 'medium'}
            {bp.isEq('large') && 'large'}
          </div>
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

          ## Status: Unstable

          The basic functionality is here, but it's in the process of being
          integrated in an existing app, and may change based on that experience.

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
        {md`
          ## Element Breakpoints

          Viewport breakpoints are great for laying out entire pages, but often
          an element should only be concerned with its own size, or the size of
          a close parent element.

          We can declaratively access the size of an element, and use breakpoints
          like we did for the viewport above.

          You can use either the high order component or render callback for element
          breakpoints, but often the render callback is more convenient since it's
          relative to the position of the ||BreakpointRender|| in the tree.

          We'll use the previous example of ||BreakpointRender||, with some alterations.

          ||||js
          <div className="SomeClass">
            <BreakpointRender breakpoints={breakpoints} type="element" element=".SomeClass">
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
          </div>
          ||||

          Let's break down the props:

          ||breakpoints|| is the same as viewport, except now it's relative to our
          outer ||div|| here.

          ||type|| is set to ||'element'||, which tells it to use element breakpoints
          instead of viewport breakpoints.

          If ||element|| is an ||HTMLElement|| (e.g. from a ref or ||document.getElementById||)
          that element will be used.

          If ||element|| isn't defined, it will default to ||':parent:'||. ||':parent:'|| uses the direct parent
          of ||BreakpointRender||. Similarly, passing ||':child:'|| will use the direct child of ||BreakpointRender||.

          If ||element|| a string selector it will be matched against the closest parent. If that element
          doesn't match, then we attempt to match it on the grandparent, and so on, until
          it finds a match, or reaches ||document.body|| where it gives up.

          If an element isn't found immediately, we schedule low priority tasks to
          attempt to find the element again. This will be the case on the initial render
          unless you pass an ||HTMLElement|| as the ||element|| property.

          So what do we do if we don't have an element to check the size of?
          We'll, that's up to you. By default, we simply don't render the
          child until we're able to create a valid breakpoint object. You can override
          this with the ||canRenderWithNullBp|| boolean prop. If set to ||true||,
          and we don't have a breakpoint, we'll pass ||bp|| as ||null||. It's up
          to you to do something appropriate with the lack of information.

          We handle all sources of the element size changing without using
          timers, nor requiring you to make any special effort. There's no significant performance
          cost in listening for element resizes.

          In this example, we're using a CSS animation to change the size of the element.
        `}
        <DemoElementBp />
        {md`
          ## Caveats

          We do our best to render the child without a wrapper node. If the type
          of the child element is a ||React.Component|| subclass, or an element
          type string (e.g. ||<div />|| has type ||'div'||), then we can render
          it without a wrapper.

          If it's e.g. a number, or the type is a functional component, we wrap
          it in a ||<span>|| with only a ||ref|| prop, and pass your element
          as the child.

          When using the high order component variant, your render method should
          return exactly one element or ||null||. With the render callback variant, your callback
          should render exactly one node or ||null||.
        `}
      </div>
    );
  }
}
