/* eslint-disable react/prop-types */
import * as React from 'react';

export default class PortalGun extends React.Component {
  constructor(gunProps) {
    super(gunProps);

    const gun = this;
    gun.listeners = [];
    gun.element = null;

    gun.Source = class PortalGunSource extends React.Component {
      componentWillUnmount() {
        gun.element = null;
        gun.listeners.forEach(listener => listener());
      }
      render() {
        gun.element = this.props.children;
        gun.listeners.forEach(listener => listener());
        return null;
      }
    };

    gun.Dest = class PortalGunDest extends React.Component {
      constructor(props) {
        super(props);
        this.state = { element: gun.element };
      }
      componentDidMount() {
        this.listener = () => {
          this.setState({ element: gun.element });
        };
        gun.listeners.push(this.listener);
      }

      componentWillUnmount() {
        gun.listeners.splice(gun.listeners.indexOf(this.listener), 1);
      }

      render() {
        return this.state.element || null;
      }
    };
  }
  render() {
    return this.props.children(this.Source, this.Dest);
  }
}
