// @flow
import * as React from 'react';
import { getElementSize, getViewportSize, type Size } from './utils/getSize';

export type Breakpoint = {
  // these can either be a number in pixels or a name of another breakpoint
  minWidth?: number | string,
  maxWidth?: number | string,

  // the breakpoint name
  name: string,
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
};

const calcBreakpoints = (bps: Array<Breakpoint>, size: Size): Relationships => {
  const { width } = size;

  let keys = [];
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
      const inverted = {
        maxWidth: 'minWidth',
        minWidth: 'maxWidth',
      };
      return solveFor(target, inverted[key]);
    }
    throw new TypeError(`Failed to solve for breakpoint ${bp.name} on ${key} with value ${bp[key] != null ? bp[key] : 'null'}`);
  };

  bps.forEach((bp) => {
    const minWidth = solveFor(bp, 'minWidth');
    const maxWidth = solveFor(bp, 'maxWidth');
    console.log(bp.name, minWidth, maxWidth);
    if (size.width >= minWidth) {
      gt.push(bp.name);
      keys.push(`gt:${bp.name}`);
    }
    if (size.width <= maxWidth) {
      lt.push(bp.name);
      keys.push(`lt:${bp.name}`);
    }
    if (size.width >= minWidth && size.width <= maxWidth) {
      eq.push(bp.name);
      keys.push(`eq:${bp.name}`);
    }
  });

  return { lt, gt, eq, key: keys.join('|||') };
};

type BreakpointChildProps = {
  bp: {
    isGt: (key: string) => boolean,
    isLt: (key: string) => boolean,
    isEq: (key: string) => boolean,
    isGte: (key: string) => boolean,
    isLte: (key: string) => boolean,
  },
};

type HocState = {
  current: ?Relationships,
  previousKey: ?string,
};

type HocProps = {};

const BreakpointHoc = (opts: BreakpointHocOpts) => (Component: React.ComponentType<any>) => {
  return class BreakpointProvider extends React.Component<HocProps, HocState> {
    cleanup: () => void;
    ownProps: BreakpointChildProps;

    constructor(props: HocProps) {
      super(props);
      this.state = {
        current: null,
        previousKey: null,
      };

      // creating this in constructor allows the child shouldComponentUpdate to pass
      // and improves our performance
      this.ownProps = {
        bp: {
          isGt: (key) => !!this.state.current && this.state.current.gt.indexOf(key) !== -1,
          isLt: (key) => !!this.state.current && this.state.current.lt.indexOf(key) !== -1,
          isEq: (key) => !!this.state.current && this.state.current.eq.indexOf(key) !== -1,
          isGte: (key) => this.ownProps.bp.isGt(key) || this.ownProps.bp.isEq(key),
          isLte: (key) => this.ownProps.bp.isLt(key) || this.ownProps.bp.isEq(key),
        },
      };
    }
    componentWillMount() {
      if (typeof window === 'undefined') return;
      if (opts.type === 'element') return;

      const size = getViewportSize();
      const relationships = calcBreakpoints(opts.breakpoints, size);
      this.setState({
        current: relationships,
        previousKey: relationships.key,
      });
    }

    maybeUpdate() {
      if (opts.type === 'viewport') {
        const size = getViewportSize();
        const relationships = calcBreakpoints(opts.breakpoints, size);
        if (relationships.key !== this.state.previousKey) {
          this.setState({
            current: relationships,
            previousKey: relationships.key,
          });
        }
      }
    }

    componentDidMount() {
      this.maybeUpdate();
      const handleResize = () => {
        this.maybeUpdate();
      };
      window.addEventListener('resize', handleResize, false);
      this.cleanup = () => window.removeEventListener('resize', handleResize, false);
    }

    componentWillUnmount() {
      if (this.cleanup) this.cleanup();
    }

    render() {
      return (
        <Component
          {...this.props}
          {...this.ownProps}

          // this ensures PureComponent will allow an update when breakpoints change
          // despite this.ownProps not changing
          __RearmUpdateKey={this.state.previousKey}
        />
      );
    }
  }
}

export { BreakpointHoc };
