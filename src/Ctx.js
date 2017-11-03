// @flow
/* eslint-disable */
import * as React from 'react';
import PropTypes from 'prop-types';

const CTX_KEY = '_rearm:Ctx';
const EMPTY_OBJECT = {};

function objShallowEqual(a: Object, b: Object) {
  if (a && !b) return false;
  if (b && !a) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  for (let i = 0; i < keysA.length; i += 1) {
    const key = keysA[i];
    if (a[key] !== b[key]) return false;
  }
  for (let i = 0; i < keysB.length; i += 1) {
    const key = keysB[i];
    if (a[key] !== b[key]) return false;
  }
  return false;
}

type CtxProps = {
  whitelist?: Array<string>,
  blacklist?: Array<string>,
  map?: (data: any) => any,
  inject: any,
  children: ((data: any) => React.Node) | React.Node,
}

// A simple store, similar to redux but with replaceState instead of dispatch
// it's intended for internal use of the Ctx component; not application code
class CtxStore {
  state = {}
  subs = [];
  subscribe(handler: Function) {
    this.subs.push(handler);
  }

  unsubscribe(handler: Function) {
    const index = this.subs.indexOf(handler);
    if (index !== -1) this.subs.splice(index, 1);
  }

  replaceState(newState: any) {
    this.state = newState;
    this.subs.forEach((sub) => {
      sub(this.state);
    });
  }
}

type CtxState = {
  updateCount: number,
}

class Ctx extends React.Component<CtxProps, CtxState> {
  store = new CtxStore();

  // just some state to change so we can trigger an update when the internal
  // state changes
  state = {
    updateCount: 0,
  }

  static contextTypes = {
    [CTX_KEY]: PropTypes.any,
  }

  static childContextTypes = {
    [CTX_KEY]: PropTypes.any,
  }

  constructor(props: CtxProps, context: any) {
    super(props, context);

    if (this.context[CTX_KEY]) {
      this.context[CTX_KEY].subscribe(this.onParentStoreChange);
    }
  }

  componentWillMount() {
    this.update(this.props, this.getParentState());
  }

  componentWillUnmount() {
    if (this.context[CTX_KEY]) {
      this.context[CTX_KEY].unsubscribe(this.onParentStoreChange);
    }
  }

  getChildContext() {
    return { [CTX_KEY]: this.store };
  }

  onParentStoreChange = () => {
    this.update(this.props, this.getParentState());
  };

  performMap(props: CtxProps, input: any) {
    let result = input;
    const { whitelist, blacklist, map, inject } = props;
    if (whitelist) {
      result = {};
      Object.keys(input).forEach((key) => {
        if (whitelist.indexOf(key) !== -1) result[key] = input[key];
      });
    }
    if (blacklist) {
      result = {};
      Object.keys(input).forEach((key) => {
        if (blacklist.indexOf(key) === -1) result[key] = input[key];
      });
    }
    if (map) {
      result = map(result);
    }
    if (inject) {
      // if none of the previous conditions matched, we still avoid mutating input
      if (result === input) result = { ...result, ...inject };
      else Object.assign(result, inject);
    }

    return result;
  }

  getParentState() {
    if (this.context[CTX_KEY]) {
      return this.context[CTX_KEY].state;
    }
    return EMPTY_OBJECT;
  }

  update(props: CtxProps, parentState: any) {
    const now = this.performMap(props, parentState);
    const prev = this.store.state;
    // const name = this.props.children.type && this.props.children.type.name || '(unknown)';
    // console.log(name, this.props.inject, now);
    if (objShallowEqual(now, prev)) {
      return;
    }

    this.store.replaceState(now);
    this.setState(s => ({ updateCount: s.updateCount + 1 }));
  }

  getChildValue() {
    return this.store.state;
  }

  componentWillReceiveProps(nextProps: CtxProps) {
    this.update(nextProps, this.getParentState());
  }

  getChildValue() {
    return this.store.state;
  }

  render() {
    // a little dance becasue flow thinks this.getChildValue() could change the type
    // of this.props.children
    let childValue = null;
    if (typeof this.props.children === 'function') {
      childValue = this.getChildValue();
    }
    if (typeof this.props.children === 'function') {
      return this.props.children(childValue);
    }
    return this.props.children;
  }
}

export default Ctx;
