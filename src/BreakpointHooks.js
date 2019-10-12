/* eslint react/prop-types: 0 */
// @flow
import * as React from 'react';

function getCurrentViewportSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function solveFor(bp, key, entries) {
  const value = bp[key];

  if (value == null) {
    if (key === 'minWidth') return 0;
    if (key === 'maxWidth') return Infinity;
  }

  if (typeof value === 'number') return value;

  if (typeof value === 'string') {
    const target = entries[value];
    const invertedMapping = {
      maxWidth: 'minWidth',
      minWidth: 'maxWidth',
    };
    const inverted = invertedMapping[key];
    const solved = solveFor(target, inverted);

    if (inverted === 'maxWidth') return solved + 1;
    return solved - 1;
  }
}

function calcBreakpoints(bps) {
  const currentSize = getCurrentViewportSize();
  const keys = [];

  const eq = [];
  const gt = [];
  const lt = [];
  const byName = {};
  let isExact = false;

  bps.forEach((bp) => { byName[bp.name] = bp; });
  bps.forEach((bp) => {
    const minWidth = solveFor(bp, 'minWidth', byName);
    const maxWidth = solveFor(bp, 'maxWidth', byName);

    if (currentSize.width >= minWidth && currentSize.width <= maxWidth) {
      eq.push(bp.name);
      if (bp.exact) {
        isExact = true;
      }
      keys.push(`eq-${bp.name}`);
    }

    if (currentSize.width > maxWidth) {
      gt.push(bp.name);
      keys.push(`gt-${bp.name}`);
    }

    if (currentSize.width < maxWidth) {
      lt.push(bp.name);
      keys.push(`lt-${bp.name}`);
    }
  });

  if (isExact) {
    keys.push(`exact-${currentSize.width}-${currentSize.height}`);
  }

  return {
    eq,
    gt,
    lt,
    key: keys.join('|||'),
    width: isExact ? currentSize.width : null,
    height: isExact ? currentSize.height : null,
  };
}

function useBreakpoint(breakpoints) {
  const [relationships, setRelationships] = React.useState(calcBreakpoints(breakpoints));

  React.useEffect(() => {
    const getSnapshotandUpdate = (prev) => {
      const newRelationships = calcBreakpoints(breakpoints);
      if (prev.key !== newRelationships.key) {
        return newRelationships;
      }
      return prev;
    };

    const handleResize = () => setRelationships(getSnapshotandUpdate);
    window.addEventListener('resize', handleResize, false);

    return () => window.removeEventListener('resize', handleResize, false);
  }, []);

  return {
    key: relationships ? relationships.key : null,
    isEq: key => !!relationships && relationships.eq.indexOf(key) !== -1,
    isGt: key => !!relationships && relationships.gt.indexOf(key) !== -1,
    isLt: key => !!relationships && relationships.lt.indexOf(key) !== -1,
    width: relationships.width || null,
    height: relationships.height || null,
  };
}

export default useBreakpoint;
