import * as React from 'react';
import { Helmet } from 'react-helmet';

const Wrapper = ({ children }) => (
  <React.Fragment>
    <Helmet>
      <meta charSet="utf-8" />

      <link rel="icon" type="image/png" href="/static/rearm-icon.png" />
      <link rel="icon" type="image/svg" href="/static/rearm-icon.svg" />
    </Helmet>
    {children}
  </React.Fragment>
);

export default Wrapper;
