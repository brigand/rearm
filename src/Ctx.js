// @flow
/* eslint-disable */
import * as React from 'react';
import PropTypes from 'prop-types';
import toIdentifier from './utils/toIdentifier'

const EMPTY_OBJECT = {};

function isPlainValue(x: any) {
  if (!x || typeof x !== 'object') return true;
  const proto = Object.getPrototypeOf(x);
  // $FlowFixMe
  return proto === Object.prototype || proto === Array.prototype;
}

function isPrimitive(x: any) {
  return !x || typeof x !== 'object';
}

function objShallowEqual(a: Object, b: Object) {
  if (isPrimitive(a) || isPrimitive(b)) return a === b;
  if (!isPlainValue(a) || !isPlainValue(b)) return false;

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

type ChildrenFunc = (data: any, fullState: any) => React.Node;

type CtxProps = {
  select?: (data: any) => any,
  set: any,
  children: any,
  ignoreRenders?: boolean,
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

let makeCtxCreatedCounter = 0;

function makeCtx(label: string = 'unknown') {
  makeCtxCreatedCounter += 1;

  const contextKey = `rearm-ctx_${makeCtxCreatedCounter}_${toIdentifier(label)}`;
  class Ctx extends React.Component<CtxProps, CtxState> {
    static makeCtx = makeCtx;
    static contextKey = contextKey;

    prevSub: any;

    store = new CtxStore();

    // just some state to change so we can trigger an update when the internal
    // state changes
    state = {
      updateCount: 0,
    }

    static contextTypes = {
      [contextKey]: PropTypes.any,
    }

    static childContextTypes = {
      [contextKey]: PropTypes.any,
    }

    getChildContext() {
      return { [contextKey]: this.store };
    }

    constructor(props: CtxProps, context: any) {
      super(props, context);

      if (this.context[contextKey]) {
        this.context[contextKey].subscribe(this.onParentStoreChange);
      }

      this.update(this.props, this.getParentState(), true)
    }

    shouldComponentUpdate(nextProps: CtxProps, nextState: CtxState) {
      if (this.state.updateCount !== nextState.updateCount) return true;

      return !nextProps.ignoreRenders;
    }

    componentWillUnmount() {
      if (this.context[contextKey]) {
        this.context[contextKey].unsubscribe(this.onParentStoreChange);
      }
    }

    onParentStoreChange = () => {
      this.update(this.props, this.getParentState());
    };

    performMap(props: CtxProps, input: any) {
      let result = input;
      const { set } = props;

      if (set) {
        result = set;
      }

      return result;
    }

    performSelect(props: CtxProps, input: any) {
      if (typeof props.select === 'function') {
        return props.select(input);
      } else if (Array.isArray(props.select)) {
        const result = {};
        props.select.forEach((key) => {
          result[key] = input[key];
        });
        return result;
      }
      return null;
    }

    getParentState() {
      if (this.context[contextKey]) {
        return this.context[contextKey].state;
      }
      return null;
    }

    update(props: CtxProps, parentState: any, isConstructor: boolean = false) {
      const now = this.performMap(props, parentState);
      const prev = this.store.state;

      const nowSub = this.performSelect(props, now) || now;
      const prevSub = this.prevSub || {};

      const mapEq = objShallowEqual(now, prev);
      const subEq = objShallowEqual(nowSub, prevSub);
      this.prevSub = nowSub;

      if (!mapEq) {
        this.store.replaceState(now);
      }

      if (!subEq && typeof this.props.children === 'function' && !isConstructor) {
        this.setState(s => ({ updateCount: s.updateCount + 1 }))
      }
    }

    componentWillReceiveProps(nextProps: CtxProps) {
      this.update(nextProps, this.getParentState());
    }

    getChildValue() {
      return this.props.select ? this.prevSub : this.store.state;
    }

    getFullState() {
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
        return this.props.children(childValue, this.getFullState());
      }
      return this.props.children;
    }
  }

  return Ctx;
}

module.exports.makeCtx = makeCtx;
