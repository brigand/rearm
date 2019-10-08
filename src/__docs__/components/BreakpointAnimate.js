import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { BreakpointRender } from '../../Breakpoint';

const breakpoints = [
  { name: 'small', maxWidth: 300 },
  { name: 'medium', minWidth: 'small', maxWidth: 600 },
  { name: 'large', minWidth: 'medium' },
];

const stretch = keyframes`
  0% {
    width: 100%;
  }

  50% {
    width: 4em;
  }

  100% {
    width: 99.5%;
  }
`;

const Demo = styled.div`
  width: 100%;
  height: 4em;
  margin: 0.5em auto;
  background: #eeeeee;
  animation-duration: 4s;
  animation-name: ${stretch};
  animation-iteration-count: infinite;
`;

const Inner = styled.div`
  padding: 1.5em 0;
  text-align: center;
`;

function BreakpointAnimate() {
  return (
    <Demo>
      <BreakpointRender breakpoints={breakpoints} type="element" element=":parent:">
        {bp => (
          <Inner>
            {bp.isEq('small') && 'small'}
            {bp.isEq('medium') && 'medium'}
            {bp.isEq('large') && 'large'}
          </Inner>
        )}
      </BreakpointRender>
    </Demo>
  );
}

export default BreakpointAnimate;
