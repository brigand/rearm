/* eslint-disable */
import * as React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ProvidesState, GetState } from '../CtxState';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

configure({ adapter: new Adapter() });

it(`works`, () => {
  let x = null;
  const A = () => (
    <ProvidesState initial={{ x: 1 }}>
      <GetState>
        {(s) => { x = s.x; return <div />; }}
      </GetState>
    </ProvidesState>
  );
  mount(<A />);
  expect(x).toBe(1);
});

it(`updates`, () => {
  let x = null;
  const A = () => (
    <ProvidesState initial={{ x: 1 }}>
      <GetState>
        {(s) => { x = s.x; return <div onClick={() => s.set({ x: 2 })} />; }}
      </GetState>
    </ProvidesState>
  );
  const w = mount(<A />);
  expect(x).toBe(1);
  w.find('div').simulate('click');
  expect(x).toBe(2);
});

it(`doesn't update children`, () => {
  let updates = 0;

  class CountsUpdates extends React.Component {
    render() {
      updates += 1;
      return this.props.children;
    }
  }

  const A = () => (
    <ProvidesState initial={{ x: 1 }}>
      <CountsUpdates><div /></CountsUpdates>
    </ProvidesState>
  );
  const w = mount(<A />);
  expect(updates).toBe(1);
  w.find('div').simulate('click');
  expect(updates).toBe(1);
  w.find('div').simulate('click');
  expect(updates).toBe(1);
});

it(`public.updateState`, () => {
  let instance = null;
  let inner = null;
  const A = () => (
    <ProvidesState initial={{ x: 1 }} ref={(ref) => { instance = ref; }}>
      <GetState>
        {(s) => { return <div ref={(ref) => { inner = ref; }}>{s.x}</div>; }}
      </GetState>
    </ProvidesState>
  );
  const w = mount(<A />);
  instance.public.updateState({ x: 3 });
  expect(inner.textContent).toBe('3');
});
