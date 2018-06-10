// @flow
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import addResizeListener from 'add-resize-listener';
import { getElementSize, getViewportSize, type Size } from './utils/getSize';

export type Breakpoint = {
  // these can either be a number in pixels or a name of another breakpoint
  minWidth?: number | string,
  maxWidth?: number | string,

  // the breakpoint name
  name: string,

  // pass the exact size and render on any size change while this
  // breakpoint is active (isEq would return true)
  exact?: boolean,
};

export type BreakpointHocOptsViewport = {
  type: 'viewport',
  breakpoints: Array<Breakpoint>,
}

export type BreakpointHocOptsElement = {
  type: 'element',
  selector?: string,
  breakpoints: Array<Breakpoint>,
}

export type BreakpointHocOpts = BreakpointHocOptsViewport | BreakpointHocOptsElement;

type Relationships = {
  lt: Array<string>,
  gt: Array<string>,
  eq: Array<string>,
  key: string,
  width: ?number,
  height: ?number,
};

const calcBreakpoints = (bps: Array<Breakpoint>, size: Size): Relationships => {
  const keys = [];
  const lt = [];
  const gt = [];
  const eq = [];
  const byName = {};

  bps.forEach((bp: Breakpoint) => {
    byName[bp.name] = bp;
  });

  const solveFor = (bp: Breakpoint, key: 'minWidth' | 'maxWidth'): number => {
    const value = bp[key];
    if (typeof value === 'number') return value;
    if (value == null) {
      if (key === 'minWidth') return 0;
      if (key === 'maxWidth') return Infinity;
    }
    // constraint from another breakpoint key
    if (typeof value === 'string') {
      const target = byName[value];
      if (!target) throw new TypeError(`Invalid breakpoint reference from ${bp.name} to ${value}`);

      // we invert the key so that e.g. minWidth of bp becomes the maxWidth of the reference
      const invertedMapping = {
        maxWidth: 'minWidth',
        minWidth: 'maxWidth',
      };
      const inverted = invertedMapping[key];
      const solved = solveFor(target, inverted);

      // offset by one so the breakpoints don't overlap
      if (inverted === 'maxWidth') return solved + 1;
      return solved - 1;
    }
    // eslint-disable-next-line max-len
    throw new TypeError(`Failed to solve for breakpoint ${bp.name} on ${key} with value ${bp[key] != null ? bp[key] : 'null'}`);
  };

  let needsExact = false;
  bps.forEach((bp) => {
    const minWidth = solveFor(bp, 'minWidth');
    const maxWidth = solveFor(bp, 'maxWidth');
    if (size.width > maxWidth) {
      gt.push(bp.name);
      keys.push(`gt:${bp.name}`);
    }
    if (size.width < minWidth) {
      lt.push(bp.name);
      keys.push(`lt:${bp.name}`);
    }
    if (size.width >= minWidth && size.width <= maxWidth) {
      eq.push(bp.name);
      if (bp.exact) {
        needsExact = true;
      }
      keys.push(`eq:${bp.name}`);
    }
  });

  if (needsExact) {
    keys.push(`exact:${size.width}:${size.height}`);
  }

  return {
    lt,
    gt,
    eq,
    key: keys.join('|||'),
    width: needsExact ? size.width : null,
    height: needsExact ? size.height : null,
  };
};

type BreakpointResultProp = {
  key: ?string,
  isGt: (key: string) => boolean,
  isLt: (key: string) => boolean,
  isEq: (key: string) => boolean,
  isGte: (key: string) => boolean,
  isLte: (key: string) => boolean,
};

// type BreakpointChildProps = {
//   bp: BreakpointResultProp,
// };

// type HocProps = {};

const BreakpointHoc = (opts: BreakpointHocOpts) => (Component: React.ComponentType<any>) => {
  const BreakpointProvider = (props: Object): React.Node => (
    <BreakpointRender breakpoints={opts.breakpoints} type={opts.type}>
      {(bp: BreakpointResultProp) => (
        <Component
          {...props}
          bp={bp}
        />
        )}
    </BreakpointRender>
  );
  return BreakpointProvider;
};

export type BreakpointRenderProps = {
  breakpoints: Array<Breakpoint>,
  type: 'viewport' | 'element',
  element?: string | HTMLElement,
  canRenderWithNullBp?: boolean,
  children: (bp: BreakpointResultProp, previousKey?: ?string) => ?React.Node,
};

type BreakpointRenderState = {
  current: ?Relationships,
  previousKey: ?string,
  bp: BreakpointResultProp,
}

class BreakpointRender extends React.Component<BreakpointRenderProps, BreakpointRenderState> {
  cleanup: () => void;
  previousElement: ?HTMLElement;
  previousElement = null;
  rootElement: ?HTMLElement;
  rootElement = null;

  // we set this when the element selector changes
  // ignored for viewport breakpoints
  useShortIdleDelay = true;

  constructor(props: BreakpointRenderProps) {
    super(props);
    this.state = {
      current: null,
      previousKey: null,
      bp: this.createBp(),
    };
  }

  createBp() {
    return {
      key: this.state.current ? this.state.current.key : null,
      isGt: (key: string) => !!this.state.current && this.state.current.gt.indexOf(key) !== -1,
      isLt: (key: string) => !!this.state.current && this.state.current.lt.indexOf(key) !== -1,
      isEq: (key: string) => !!this.state.current && this.state.current.eq.indexOf(key) !== -1,
      isGte: (key: string) => this.state.bp.isGt(key) || this.state.bp.isEq(key),
      isLte: (key: string) => this.state.bp.isLt(key) || this.state.bp.isEq(key),
      width: () => (this.state.current && this.state.current.width) || null,
      height: () => (this.state.current && this.state.current.height) || null,
    };
  }

  componentWillMount() {
    if (typeof window === 'undefined') return;
    if (this.props.type === 'element') return;

    // sets this.previousElement when type="element" which we use below
    this.setupListeners();

    const size = this.previousElement
      ? getElementSize(this.previousElement)
      : getViewportSize();

    const relationships = calcBreakpoints(this.props.breakpoints, size);
    this.setState({
      current: relationships,
      previousKey: relationships.key,
      bp: this.createBp(),
    });
  }

  maybeUpdate() {
    let size;
    if (this.props.type === 'element') {
      const element = this.getElement();
      if (element) {
        size = getElementSize(element);
      } else {
        // shouldn't ever happen, but we need some valid value here
        size = getViewportSize();
      }
    } else {
      size = getViewportSize();
    }

    const relationships = calcBreakpoints(this.props.breakpoints, size);
    if (relationships.key !== this.state.previousKey) {
      this.setState({
        current: relationships,
        previousKey: relationships.key,
        bp: this.createBp(),
      });
    }
  }

  componentDidMount() {
    this.maybeUpdate();
    this.setupListeners();
  }

  getElement(): ?HTMLElement {
    const element = this.props.element || null;

    // default case; direct parent
    if (element === ':parent:' || !element) {
      const pElement: ?HTMLElement = this.rootElement;
      return pElement && (pElement.parentElement: any);
    }

    // the direct child can be used
    if (element === ':child:') {
      const pElement: ?HTMLElement = this.rootElement;
      return pElement;
    }

    // css selector, follows parent tree
    if (typeof element === 'string') {
      const query = element;

      let pElement: ?HTMLElement = this.rootElement;
      while (pElement && pElement !== document.body && !pElement.matches(query)) {
        const parent = pElement.parentElement;
        if (parent instanceof HTMLElement) {
          pElement = parent;
        } else {
          return null;
        }
      }
      return pElement || null;
    }
    if (element instanceof HTMLElement) {
      return element;
    }
    return null;
  }

  setupListeners() {
    const handleResize = () => {
      this.maybeUpdate();
    };

    if (this.props.type === 'viewport') {
      if (this.cleanup) this.cleanup();
      window.addEventListener('resize', handleResize, false);
      this.cleanup = () => window.removeEventListener('resize', handleResize, false);
    } else if (this.props.type === 'element') {
      const element = this.getElement();

      // either element has changed, or it became null
      // either way, we should clean up existing listeners
      // eslint-disable-next-line eqeqeq
      if (element != this.previousElement) {
        if (this.cleanup) this.cleanup();
      }

      // if it's a sibling element, it won't be rendered immediately when this
      // component mounts, so element might be null
      if (!element) {
        if (this.cleanup) this.cleanup();

        // use idle callback because it's possible the element will never exist
        // and we don't want to use too many resources
        // on the initial mount we want to retry ASAP
        let timeout = 250;
        if (this.useShortIdleDelay) {
          timeout = 1;
          this.useShortIdleDelay = false;
        }
        const idleCallbackToken = window.requestIdleCallback(() => {
          // try again
          this.setupListeners();
          this.maybeUpdate();
        }, { timeout });

        this.cleanup = () => window.cancelIdleCallback(idleCallbackToken);
        return;
      }

      this.previousElement = element;
      this.cleanup = addResizeListener(element, () => {
        this.maybeUpdate();
      });
    }
  }

  componentWillUnmount() {
    if (this.cleanup) this.cleanup();
  }

  wrapChildren(children: React.Node) {
    if (this.props.type !== 'element') return children;

    const childNode = React.Children.only(children);

    const wrapperProps = {
      ref: (el: ?HTMLElement) => {
        if (el instanceof HTMLElement) {
          this.rootElement = el;
        } else {
          this.rootElement = null;
        }
      },
    };

    if (!childNode || typeof childNode !== 'object') {
      return <span {...wrapperProps}>{childNode}</span>;
    }

    if (typeof childNode.type === 'string') {
      return React.cloneElement(childNode, wrapperProps);
    }

    if (typeof childNode.type === 'function'
      // and is not functional component
      && Object.getPrototypeOf(childNode.type) !== Function.prototype) {
      return React.cloneElement(childNode, {
        ref: (instance: React.Component<any>) => {
          if (!instance) this.rootElement = null;
          else {
            // eslint-disable-next-line
            const el = findDOMNode(instance);
            if (el instanceof HTMLElement) {
              this.rootElement = el;
            } else {
              this.rootElement = null;
            }
          }
        },
      });
    }

    // functional component
    return <span {...wrapperProps}>{childNode}</span>;
  }

  render() {
    if (this.props.type === 'element' && !this.props.canRenderWithNullBp) {
      if (!this.state.current) {
        return this.wrapChildren(<span />);
      }
    }
    return this.wrapChildren(this.props.children(this.state.bp));
  }
}

export { BreakpointHoc, BreakpointRender };
