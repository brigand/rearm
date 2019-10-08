import * as React from 'react';
import styled from 'styled-components';
import { BreakpointRender } from '../../Breakpoint';

const breakpoints = [
  { name: 'small', maxWidth: 600 },
  { name: 'medium', minWidth: 'small', maxWidth: 'large' },
  { name: 'large', minWidth: 1200 },
];

const Item = styled.li`
  padding: 1em;
  list-style-type: none;
  background-color: ${props => (props.active ? '#a0ffa9' : 'transparent')};
`;

function BreakpointDemo() {
  return (
    <div>
      <BreakpointRender breakpoints={breakpoints} type="viewport">
        {bp => (
          <ul>
            <Item active={bp.isEq('small')}>Equal to small? {String(bp.isEq('small'))}</Item>
            <Item active={bp.isEq('medium')}>Equal to medium? {String(bp.isEq('medium'))}</Item>
            <Item active={bp.isEq('large')}>Equal to large? {String(bp.isEq('large'))}</Item>
          </ul>
        )}
      </BreakpointRender>
    </div>
  );
}

export default BreakpointDemo;
