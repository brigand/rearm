import * as React from 'react';
import md from '../md';
import PortalGun from '../../PortalGun.js';
import './DocsPortalGun.css';

export default class DocsPortalGun extends React.Component {
  render() {
    return (
      <div>
        {md`
          # Portal Gun

          The ||PortalGun|| module allows defining UI in one place in the tree,
          and shooting it to a near-by location elsewhere in the tree.

          ## Status: Unstable

          The basic functionality is here, but it's in the process of being
          integrated in an existing app, and may change based on that experience.

          ${/*## Why? TODO */''}


          ## Example

          You use PortalGun by first creating a scope. This takes the form of a
          render callback component. It receives two arguments which are the
          Source and Dest components.

          First you'll need a component that renders a ||PortalGun||. Each instance
          gets its own Source and Dest component. Note that ||Source|| should
          only be used in one place, but you can use ||Dest|| anywhere you like.

          ||||js
          const ExampleOne = () => (
            <PortalGun>
              {(Source, Dest) => (
                <div>
                  <h2>Make Selections</h2>
                  <Options Source={Source} />
                  <h2>Your selections:</h2>
                  <Dest />
                </div>
              )}
            </PortalGun>
          );
          ||||

          Then you'll need a component to provide the value for ||Source||.
          In this example, that'll be done inside ||Options||.

          ||||js
          class Options extends React.Component {
            state = { a: false, b: false, c: false }
            render() {
              const { Source } = this.props;
          
              const toggle = // updates state
          
              return (
                <div>
                  <label><input type="checkbox" onClick={toggle('a')} /> A</label>
                  {/* etc */}
                  <Source>
                    <ul>
                      {/* render list item */}
                    </ul>
                  </Source>
                </div>
              );
            }
          }
          ||||

          Note that in this case, ||Options|| holds the full state and defines the UI
          for representing that state, but ||ExampleOne|| decides where to put the rendered
          output. In this case, it wants to put an ||<h2>|| element between ||Options|| and ||Dest||.

          There are no restrictions on where ||Source|| and ||Dest|| appear in the tree.

          If there isn't currently a ||Source|| element, then ||Dest|| will render nothing.
        `}
        <ExampleOne />
      </div>
    );
  }
}

const ExampleOne = () => (
  <PortalGun>
    {(Source, Dest) => (
      <div>
        <h2>Make Selections</h2>
        <Options Source={Source} />
        <h2>Your selections:</h2>
        <Dest />
      </div>
    )}
  </PortalGun>
);

class Options extends React.Component {
  state = { a: false, b: false, c: false }
  render() {
    const { Source } = this.props;

    const toggle = (l) => () => this.setState({[l]: !this.state[l] });

    return (
      <div>
        <label><input type="checkbox" onClick={toggle('a')} /> A</label>
        <label><input type="checkbox" onClick={toggle('b')} /> B</label>
        <label><input type="checkbox" onClick={toggle('c')} /> C</label>
        <Source>
          <ul>
            {Object.entries(this.state).map(([k, v]) => <li key={k}>{`${k}: ${v ? 'checked' : 'not checked'}`}</li>)}
          </ul>
        </Source>
      </div>
    );
  }
}
