// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import DocsBreakpoint from './apis/DocsBreakpoint';

type Props = {

}

class Docs extends React.Component<Props> {
  render() {
    return (
      <div>
        <DocsBreakpoint />
      </div>
    );
  }
}

ReactDOM.render(<Docs />, document.getElementById('root'));
