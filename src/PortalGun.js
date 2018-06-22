/* eslint-disable react/prop-types */
import * as React from 'react';
import randId from './utils/randId';

export default class PortalGun extends React.Component {
  constructor(gunProps) {
    super(gunProps);

    const gun = this;

    // Dests subscribe here
    const listeners = [];

    // We maintain a list of ids
    const sourceIds = [];
    const idsToNodes = {};

    // We don't want multiple nextTick calls running at once which
    // would cause multiple updates if there are multiple Source elements
    // that are updating.
    let nextTickQueued = false;
    let dirty = false;

    const queueUpdate = () => {
      if (nextTickQueued || !dirty) return;
      nextTickQueued = true;
      dirty = false;
      process.nextTick(() => {
        nextTickQueued = false;
        listeners.forEach((listener) => {
          listener();
        });
      });
    };

    gun.Source = class PortalGunSource extends React.Component {
      id = randId('rearm/PortalGunSource');

      constructor(props) {
        super(props);
        sourceIds.push(this.id);
        idsToNodes[this.id] = this.props.children;
        dirty = true;
      }

      componentWillUnmount() {
        delete idsToNodes[this.id];
        sourceIds.splice(sourceIds.indexOf(this.id), 1);
        dirty = true;
        queueUpdate();
      }

      componentDidMount() {
        queueUpdate();
      }

      componentDidUpdate() {
        queueUpdate();
      }

      render() {
        idsToNodes[this.id] = this.props.children;
        dirty = true;
        return null;
      }
    };

    gun.Dest = class PortalGunDest extends React.PureComponent {
      constructor(props) {
        super(props);
        // eslint-disable-next-line react/no-unused-state
        this.state = { counter: 1 };
      }
      componentDidMount() {
        this.listener = () => {
          dirty = false;
          this.setState(s => ({ counter: s.counter + 1 }));
        };
        listeners.push(this.listener);
      }

      componentWillUnmount() {
        listeners.splice(listeners.indexOf(this.listener), 1);
      }

      render() {
        return sourceIds.map(id => (
          <React.Fragment key={id}>
            {idsToNodes[id]}
          </React.Fragment>
        ));
      }
    };
  }
  render() {
    return this.props.children(this.Source, this.Dest);
  }
}
