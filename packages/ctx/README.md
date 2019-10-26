[@rearm/ctx Website](https://rearm.brigand.me/ctx) -
[Source Code](https://github.com/brigand/rearm//tree/master/packages/ctx)

<!-- Note: Don't edit this file. See these files:
     - rearm/scripts/readme
     - rearm/packages/ctx/src/__docs__/ctx.mdx -->

# @rearm/ctx

You can install the package with npm or yarn. It requires React 16.4 or newer for
hooks.

```sh
npm install @rearm/ctx
# or
yarn add @rearm/ctx
```

## Intent

The Ctx module provides a stable and declarative interface to the concept of "context"
in React. It's represented as a single object with a `Provider` and a `use` hook as
the two sides.

Unlike a typical React context, a component may subscribe to specific parts of the
context, or computations based on the context. This has been a very important aspect
of react-redux for many years, and can now be leveraged with custom contexts.

## Usage

First create your context instance. You may create as many as you like, and there is
no interaction between separate contexts, so it's suitable for applications and
libraries.

```javascript
import { makeCtx } from 'rearm/lib/Ctx';
const MyCtx = makeCtx();
```

If you're using typescript, you may wish to explicitly define a type for the context.
As you would expect, both `Provider` and `use` will incorporate the generic in their
types.

```typescript
import { makeCtx, Ctx } from 'rearm/lib/Ctx';
const MyCtx: Ctx<{ color: string }> = makeCtx();
```

Anywhere in the tree you can define the context by rendering a `Provider` with the
`value` you would like to pass through context. You may have multiple instances of the
`Provider` rendered in different parts of the page, or "shadow" a parent provider if
they're nested. A `MyCtx.Provider` must exist as an (indirect) parent of any component
attempting to call `MyCtx.use`.

```javascript
render() {
  return (
    <MyCtx.Provider value={{ color: 'hotpink' }}>
      <B />
    </MyCtx.Provider>
  );
}
```

You may then access the context by calling `Ctx.use` with an optional selector
function. If not provided, then the entire context value will be returned.

```javascript
function B() {
  const color = Ctx.use((state) => state.color);
  return <p style={{ color }}>Hello, World!</p>;
}
```

If you use typescript, then the value of `color` should be inferred to be `string`, as
we defined the context to be `Ctx<{ color: string }>`.
