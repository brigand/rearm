// @flow
import * as React from 'react';
import Ctx from './Ctx';

type UpdateIfChangedProps = {
  children: React.Node,
  updateIfChanged: any,
};

class UpdateIfChanged extends React.Component<UpdateIfChangedProps> {
  shouldComponentUpdate(nextProps) {
    if (nextProps.updateIfChanged == null || nextProps.updateIfChanged !== this.props.updateIfChanged) {
      return true;
    }
    return false;
  }

  render() {
    return this.props.children;
  }
}

type ProvidesStateProps<StateShape> = {
  initial: StateShape,
  children: React.Node,
  /* global $Shape */
  updaters: {[methodName: string]: (...args: Array<any>) => $Shape<StateShape>},
};

type ProvidesStateState = {
  updates: number,
};

type GetStateProps = {
  children: (arg: any) => React.Node,
};

function makeCtxState(key: string) {
  const id = Math.random().toString().slice(2);
  // $FlowFixMe
  const StateCtx = Ctx.makeCtx(`CtxState:${key}:${id}`);

  class ProvidesState extends React.Component<ProvidesStateProps<*>, ProvidesStateState> {
    // eslint-disable-next-line react/no-unused-state
    state = { updates: 0 };

    _originalSetState = this.setState;
    setState = () => {
      throw new Error(`Attempted to call .setState on a CtxState instance. Use 'inst.updateState' instead`);
    }

    public = {
      updateState: (update: any) => {
        this.currState = { ...this.currState, ...update };
        this.doUpdate();
      },
    }

    doUpdate() {
      // $FlowFixMe
      this._originalSetState(s => ({ updates: s.updates + 1 }));
    }

    updaters = this.props.updaters ?
      Object.keys(this.props.updaters).reduce((acc, methodName) => {
        acc[methodName] = (...args: Array<any>) => {
          const partialState = this.props.updaters[methodName](this.currState, ...args);
          this.currState = { ...this.currState, ...partialState };
          this.doUpdate();
        };
        return acc;
      }, {})
      : { set: this.public.updateState }

    currState = { ...this.props.initial, ...this.updaters };

    render() {
      return (
        <StateCtx inject={this.currState}>
          <UpdateIfChanged updateIfChanged={this.props.children}>
            {this.props.children}
          </UpdateIfChanged>
        </StateCtx>
      );
    }
  }

  class GetState extends React.Component<GetStateProps> {
    render() {
      return (
        // $FlowFixMe
        <StateCtx {...this.props} />
      );
    }
  }

  Object.defineProperty(ProvidesState, 'name', {
    value: `Rearm:ProvidesState:${key}`,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(GetState, 'name', {
    value: `Rearm:GetState:${key}`,
    configurable: true,
    writable: true,
  });

  return { ProvidesState, GetState, makeCtxState };
}

const DefaultCtxState = makeCtxState('default');

module.exports = DefaultCtxState;
