// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import DocsBreakpoint from './apis/DocsBreakpoint';
import './Docs.css';

type Props = {

}

class Docs extends React.Component<Props> {
  render() {
    return (
      <div className="Docs">
        <div className="Docs__Page">
          <DocsBreakpoint />
        </div>
      </div>
    );
  }
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.render(<Docs />, root);
}
