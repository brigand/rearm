import * as React from 'react';
// import PropTypes from 'prop-types';
import md from '../md';
import Ctx from '../../Ctx';
import './DocsCtx.css';


export default class DocsCtx extends React.Component {
  render() {
    return (
      <div>
        {md`
          # Ctx

          The ||Ctx|| module provides a stable and declarative interface to the concept
          of "context" in React.

          One component is used for creating, filtering, transforming, and accessing
          context. It can do any combination of these operations.

          ## Status: Alpha

          The component needs more tests and use in real apps. Try it out and
          report any issues you run into.

          ## Why?

          Context in React is very powerful, but the basic usage of it has an
          unfriendly api, and has issues like either requiring the entire
          tree to render on context changes, or the children missing updates
          entirely.

          We avoid the update/performance issues by using an event emitter where
          each ||Ctx|| instance listens for changes to the nearest parent ||Ctx||.

          The API of ||Ctx|| works like implicit props, allowing components below
          the ||Ctx|| to access data without every component passing the props around.
          This can be useful for, e.g. themes, dependency injection, or global state management.

          Further, the refinement of the data using ||blacklist||, ||whitelist||, and ||map||
          (explained below) allow you to control which parts of the state the children see.

          ## Basic Usage

          First import ||Ctx||.

          ||||jsx
          import Ctx from 'rearm/Ctx';
          ||||

          Anywhere in the tree you can define some context keys. The ||inject||
          value is shallowly merged into the parent context, if any exists. This
          in no way affects the parent context.

          ||||jsx
          render() {
            return (
              <Ctx inject={{ color: 'hotpink' }}>
                <Something />
              </Ctx>
            );
          }
          ||||

          Within the children of ||Ctx||, no matter how deep, we can extract properties
          from the context in render by passing a render callback child to ||Ctx||. This render
          callback will run any time a parent ||Ctx|| updates.

          ||||jsx
          render() {
            return (
              <Ctx>
                {c => <div style={{ color: c.color }}>Hello, world!</div>}
              </Ctx>
            );
          }
          ||||

          ## Filtering

          Filtering is the process of ignoring context properties the children shouldn't care about.

          The technical use case for filtering is an optimization. In the previous example,
          we said "any time a parent ||Ctx|| changes". This means it would update
          even if a key other than 'color' was updated. In this case, we only need
          one key, so we can ignore the others, and not receive updates from them.

          ||||jsx
          render() {
            return (
              <Ctx whitelist={['color']}>
                {c => <div style={{ color: c.color }}>Hello, world!</div>}
              </Ctx>
            );
          }
          ||||

          Note that this affects the entire subtree under the ||Ctx|| using ||whitelist||. All
          other properties are invisilbe.

          In the future, distinguishing the desired subtree context from the immediate
          subscription may be added.

          Conversely you may use ||blacklist|| to specify properties you're
          not interested in.

          The more subjective quality of filtering is that you can hide information
          from the children. If well applied, this can reduce the number of locations
          in your code where state can be accessed or updated.

          ## Mapping

          The ||map|| prop is a function that takes the entire parent context and returns a new object
          that will become the context for the subtree. ||inject||, ||whitelist||,
          and ||blacklist|| could all be implemented with ||map||.

          In this example, we'll say ||c|| is ||{ x: 4 }||. We also use
          "object spread" syntax to pass through the other values of context.
          If we did ||c => ({ x: Math.pow(c.x, 2) })|| then all other
          context keys would be omitted in the subtree context.

          ||||jsx
          render() {
            return (
              <Ctx map={c => ({ ...c, x: Math.pow(c.x, 2) })}
            );
          }
          ||||

          After ||map|| runs, any values from ||inject|| are added to the result.

          If we pass a render callback to ||Ctx|| while using these props, it
          will see the result after these transforms.

          ## Sending data back up

          Much like normal usage of props in React, you can pass callback functions
          through the context, and a child can access and call them.

          Take this component for example where we hold a piece of state (a counter)
          and pass both the current count and a function to increment it down the tree.

          ||||jsx
          class C extends React.Component {
            state = {
              count: 1,
            }
            incr = () => this.setState({ count: this.state.count + 1 });

            render() {
              const context = {
                counter: { count: this.state.count, incr: this.incr },
              };
              return (
                <Ctx inject={context}>
                  <SomeChild />
                </Ctx>
              );
            }
          }
          ||||

          Then in ||SomeChild|| or one of its children, we can access the context,
          and call the ||incr|| function.

          ||||
          const SomeChild = () => (
            <Ctx>
              {c => (
                <button onClick={c.counter.incr}>
                  Clicked {c.counter.incr} times
                </button>
              )}
            </Ctx>
          );
          ||||

          ## makeCtx

          The default ||Ctx|| uses one namespace for all of your context properties.
          This also means the operations that filter or map the context can impact
          children. Intermediate ||Ctx|| elements can accidentally override a parent
          context key. To get around this, you can create a ||Ctx|| that uses a different
          React context key.

          ||||jsx
          const MyCtx = Ctx.makeCtx('my-unique-key');

          <MyCtx inject={...}>
          ||||

          Then you use ||MyCtx|| in places where you want to receive or inject
          that context. It won't clash with any other ||Ctx|| elements on the page.
        `}
      </div>
    );
  }
}
