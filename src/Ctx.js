// @flow
/* eslint-disable */
import * as React from 'react';
import PropTypes from 'prop-types';
import toIdentifier from './utils/toIdentifier'

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
  map?: (data: any) => any,
  subscribe?: (data: any) => any,
  inject: any,
  children: ((data: any) => React.Node) | React.Node,
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

      this.update(this.props, this.getParentState())
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
      const { map, inject } = props;

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

    performSubscribe(props: CtxProps, input: any) {
      if (typeof props.subscribe === 'function') {
        return props.subscribe(input);
      } else if (Array.isArray(props.subscribe)) {
        const result = {};
        props.subscribe.forEach((key) => {
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
      return EMPTY_OBJECT;
    }

    update(props: CtxProps, parentState: any) {
      const now = this.performMap(props, parentState);
      const prev = this.store.state;

      const nowSub = this.performSubscribe(props, now) || now;
      const prevSub = this.prevSub || {};

      const mapEq = objShallowEqual(now, prev);
      const subEq = objShallowEqual(nowSub, prevSub);
      this.prevSub = nowSub;

      if (!mapEq) {
        this.store.replaceState(now);
      }

      if (!subEq) {
        this.setState(s => ({ updateCount: s.updateCount + 1 }))
      }
    }

    componentWillReceiveProps(nextProps: CtxProps) {
      this.update(nextProps, this.getParentState());
    }

    getChildValue() {
      return this.prevSub || this.store.state;
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

  return Ctx;
}

const DefaultCtx = makeCtx('_rearm:Ctx');

module.exports = DefaultCtx;
