import * as React from 'react';

export default class PortalGun extends React.Component {
  constructor(props) {
    super(props);

    this.listeners = [];
    this.element = null;

    this.Source = ({ children }) => {
      this.element = children;
      this.listeners.forEach((l) => l(this.element));
      return null;
    };

    const gun = this;
    this.Dest = class PortalGunDest extends React.Component {
      constructor(props) {
        super(props);
        this.state = { element: gun.element };
      }
      componentDidMount() {
        this.listener = () => {
          this.setState({ element: gun.element });
        }
        gun.listeners.push(this.listener);
      }

      componentWillUnmount() {
        gun.listeners.splice(gun.listeners.indexOf(this.listener), 1);
      }

      render() {
        return this.state.element || null;
      }
    }
  }
  render() {
    return this.props.children(this.Source, this.Dest);
  }
}
