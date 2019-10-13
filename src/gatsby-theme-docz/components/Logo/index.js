import React from 'react';
import logo from '../../../../../src/rearm-icon.png';

// eslint-disable-next-line import/prefer-default-export
export const Logo = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      lineHeight: '1',
      fontSize: '1.3em',
    }}
  >
    <img
      src={logo}
      alt="rearm"
      style={{ width: '1em', height: '1em', marginRight: '0.4em' }}
    />
    <div>Rearm</div>
  </div>
);
