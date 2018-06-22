
## 0.13.0

PortalGun bug fixes and supports multiple Source's

It's mostly a rewrite of PortalGun to behave correctly
in more cases. It tries to work better with the React
lifecycle, and update exactly when it needs to.

## 0.12.0

major Ctx changes, reducing API

- the `map` prop was removed.
- `subscribe` was renamed to `select`
- `inject` replaced with `set`, which doesn't merge
- support primitives for state
- consider non-plain objects as always non-equal

Removes CtxState. It was a bad API.

## pre 0.12.0

Changelog didn't exist, but all APIs were
very unstable.

