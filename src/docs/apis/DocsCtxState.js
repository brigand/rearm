import * as React from 'react';
// import PropTypes from 'prop-types';
import md from '../md';
import CtxState from '../../CtxState';
import './DocsCtxState.css';


export default class DocsCtxState extends React.Component {
  render() {
    return (
      <div>
        {md`
          # CtxState

          The ||CtxState|| module provides a simple and high performance state
          manager.

          The state can be accessed by children of the ||ProvidesState|| element
          by using a ||GetState|| element. Unlike ||setState|| in React, only
          the components interested in the state are updated. Unlike Redux,
          the state is scoped to the part of the app that needs it, and multiple
          instances of a component can each have their own state.

          ## Status: Alpha

          The basic functionality is there, but more information from usage is
          required.

          ## Usage

          While a default state provider is provided, I recommend creating
          a state component pair for each feature using state.

          The default state provider can be imported like so:

          ||||js
          import { ProvidesState, GetState } from 'rearm/lib/CtxState';
          ||||

          Or you can create one or more state providers using ||makeCtxState||.
          The optional name can aid in debugging, but we generate a random context id
          when ||makeCtxState|| is called.

          ||||js
          import { makeCtxState } from 'rearm/lib/CtxState';
          const { ProvidesState, GetState } = makeCtxState('optional name');
          ||||

          ## Example

          The ||ProvidesState|| component creates a state context for its children.
          We'll explain what the ||SuperExpensiveComponent|| illustrates later.

          ||||jsx
          const C = () => {
            <ProvidesState initial={{count: 0}}>
              <Display />
              <Incr />
              <SuperExpensiveComponent />
            </ProvidesState>
          };
          ||||

          We can then access the state in children, no matter how deep in the
          tree they are. Here we're implementing one of the elements used in
          the previous code block.

          ||||jsx
          const Display = () => (
            <GetState>
              {s => \`Count is \${s.count}\`}
            </GetState>
          );
          ||||

          Children can also update the state, similar to a ||setState|| call. The
          properties are shallowly merged into the ||ProvidesState||'s state,
          and then components (e.g. ||Display||) that use the state will be updated.

          ||||jsx
          const Incr = () => (
            <GetState>
              {s => <button onClick={() => {
                s.set({ count: s.count + 1 });
              }}>Increment</button>}
            </GetState>
          );
          ||||

          When the state updates, all subscribing elements are updated. Remember
          the ||SuperExpensiveComponent|| from the first code block? It isn't updated
          because it doesn't subscribe to the state. It might have a child of a child
          of a child that uses ||GetState||, which will update, but not the whole
          component.

          This is an important part of ||CtxState||, in that it can give significant
          performance boosts when used properly.

          ## Updating State from the parent

          Since ||ProvidesState|| only takes the initial state as a prop, there's
          no declarative way to update its state. While you should avoid this,
          there is an escape hatch for updating its state from the parent.

          You can place a ||ref|| on the ||ProvidesState|| and call its one public method.

          ||||jsx
          <ProvidesState initial={{count: 0}} ref={(ps) => { this.ps = ps; }}>
          ||||

          Somewhere else in that component:

          ||||jsx
          this.ps.public.updateState({ count: 1 });
          ||||

          ## Redux

          This is not intended as a full replacement for redux; simply an alternative
          when redux doesn't elegantly solve your state management problems. Not
          all state should go in one global store. ||CtxState|| can be used in combination with
          redux or any other state store, or used on its own.

          ## Summary

          ||CtxState|| allows you to perform high performance state updates without
          relying on global state stores like redux.

          ## TODO

          Some features aren't documented yet, such as ||GetState|| supporting the full
          ||Ctx|| api, or the ||updaters|| api. If you're interested, check out the
          [source on GitHub](https://github.com/brigand/rearm/blob/master/src/CtxState.js).
        `}
      </div>
    );
  }
}
