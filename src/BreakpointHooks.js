/* eslint react/prop-types: 0 */
// @flow
import * as React from 'react';

const includes = (arr, item) => arr.includes(item);

function getCurrentViewportSize() {
  return { width: global.innerWidth, height: global.innerHeight };
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
    const solved = solveFor(target, inverted, entries);

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
    key: keys.join('|||'),
    width: isExact ? currentSize.width : null,
    height: isExact ? currentSize.height : null,
    eq,
    gt,
    lt,
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

  const currentBreakpoint = React.useMemo(() => {
    const isEq = key => includes(relationships.eq, key);
    const isGte = key => includes(relationships.gt, key) || isEq(key);
    const isLte = key => includes(relationships.lt, key) || isEq(key);

    const isGt = key => isGte(key) && !isEq(key);
    const isLt = key => isLte(key) && !isEq(key);

    const { width, height, key } = relationships;

    return {
      isEq,
      isGte,
      isLte,
      isGt,
      isLt,
      key,
      width,
      height,
    };
  }, [relationships.key]);

  return currentBreakpoint;
}

export default useBreakpoint;
