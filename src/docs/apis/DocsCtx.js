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

          One component is used for creating, transforming, and accessing
          context. It can do any combination of these operations.

          ## Status: Beta

          This component is being tested in a big app, and has undergone a partial redesign
          based on that experience.

          ## Why?

          Context in React is very powerful, and recently redesigned, but each version of
          the context API has had different issues. Formerly, the API required class components,
          significant boilerplate, and you had to implement subscriptions yourself.

          The new official context API lacks refinement in subscriptions, which are important
          in general, but would also allow context to be used as a powerful optimization
          tool.

          We avoid the update/performance issues by using events to communicate between
          ||Ctx|| usages.
          
          We allow refinement in subscriptions (see ||subscribe||), and the ability to decline updates from
          other sources (see ||ignoreRenders||).

          ## Basic Usage

          First import ||makeCtx||, and then create a ||Ctx|| component.

          ||||jsx
          import { makeCtx } from 'rearm/lib/Ctx';
          const Ctx = makeCtx('some-description');
          ||||

          Anywhere in the tree you can define the context by using the ||set|| prop.
          This in no way affects the parent context.

          ||||jsx
          render() {
            return (
              <Ctx set={{ color: 'hotpink' }}>
                <Something />
              </Ctx>
            );
          }
          ||||

          Within the children of ||Ctx||, no matter how deep, we can map the context to React
          nodes in render  by passing a render callback child to ||Ctx||. The render
          callback will run any time the nearest parent ||Ctx|| updates, since we haven't defined
          any refinement (more on that later).

          ||||jsx
          render() {
            return (
              <Ctx>
                {c => <div style={{ color: c.color }}>Hello, world!</div>}
              </Ctx>
            );
          }
          ||||

          ## select

          You may only be interested in part of the context.

          You might use the ||select|| prop to e.g. access a specific item by id, or a specific field of
          a piece of data.

          In the simplest case, you can pass an array of properties to access.

          ||||jsx
          <Ctx select={['foo', 'bar']}>
            {({ foo, bar }) => <div>{foo} {bar}</div>}
          </Ctx>
          ||||

          A function can be passed, which allows you to produce any result you want, and if it's an object/array,
          its properties will be shallowly compared to the previous result. The argument is the state provided by the
          parent ||Ctx||, if any. In this case, we want to access a specific user by id, and then render
          their name. This will update any time ||users[props.userId]|| changes.

          ||||jsx
          <Ctx select={(users) => users[props.userId])}>
            {user => <div>{user.name}</div>}
          </Ctx>
          ||||

          Of course, we can be more specific in this case, and only subscribe to the user's name changing.

          ||||jsx
          <Ctx select={(users) => users[props.userId].name}>
            {name) => <div>{name}</div>}
          </Ctx>
          ||||

          ## ignoreRenders

          There's one more problem with our performance story; one that's intrinsic to using
          declarative components to provide context: context is provided when **Ctx is rendered**,
          then its **children will render**, and so on, down the tree.

          Sometimes those updates will get blocked by a ||PureComponent|| class or similar, but
          we can at least stop a ||Ctx|| from rendering when its parent changes. This is a slightly
          dangerous tool, but it's fairly easy to get right when you know the trick.

          First, let's introduce the ||ignoreRenders|| prop. When ||ignoreRenders|| is provided (and
          set to a "truthy" value), the ||Ctx|| won't implicitly render when the parent rerenders.

          Instead, it invokes ||select||, and will update if that produces a new result. Let's start
          by defining a **broken** component that uses ||ignoreRenders||.

          ||||jsx
          const MyComponent = (props) => (
            <div>
              Name: {props.name}
              Age: {props.age}

              <Ctx
                ignoreRenders
                select={theme => theme.color}
              >
                {color => (
                  <div
                    style={{ color }}
                  >
                    {props.name}
                  </div>
                )}
              </Ctx>
            </div>
          )
          ||||
          
          Since we've defined ||ignoreRenders|| on ||Ctx||, it won't update when ||MyComponent|| updates.
          Instead, it'll update when ||theme.color|| in the context changes. This means we're
          missing changes to ||props.name||. This is bad, but how do we fix it?

          Simple, we subscribe to ||props.name||!

          ||||jsx
          <Ctx
            ignoreRenders
            select={theme => [theme.color,props.name]}
          >
            {([color, name]) => (
              <div
                style={{ color }}
              >
                {name}
              </div>
            )}
          </Ctx>
          ||||

          Now our themed element will update in exactly two cases:

          - the context contains a new ||theme.color||
          - ||MyComponent|| receives a new ||name||.

          We also had ||props.age||, but since we don't need that inside the ||Ctx||,
          we simply don't subscribe to it.

          The combination of ||ignoreRenders|| and ||select|| could even be useful
          when not using context at all!

          ## Summary

          The ||set|| prop allow us to define the context our indirect
          children will see.

          By using ||select|| and ||ignoreRender|| we know exactly what will cause us
          to re-render.

          With ||makeCtx|| we can avoid creating massive string-based namespaces for our apps.

          We can use ||Ctx|| to allow for powerful management of data flowing through our
          app, and to gain control of performance when we need it.
        `}
      </div>
    );
  }
}

class B extends React.PureComponent {
  render = () => (
    <Ctx>
      {data => <span id="target">{(console.log(data.x), data.x)}</span>}
    </Ctx>
  )
};

class Example extends React.Component {
  state = {
    x: 100,
  }
  render() {
    return (
      <div>
        <button type="button" onClick={() => this.setState({ x: this.state.x + 1 })}>incr</button>
        <Ctx ignoreRenders inject={{ x: this.state.x }}>
          <div>
            {this.state.x}
            <B />
          </div>
        </Ctx>
      </div>
    );
  }
}