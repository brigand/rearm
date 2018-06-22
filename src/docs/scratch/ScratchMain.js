import * as React from 'react';
import PortalGun from '../../PortalGun';

const components = [

];

function getForName(name) {
  if (!name) return null;

  return components.find(x => x.name.indexOf(name) !== -1);
}


function getComp() {
  return getForName(window.location.hash.slice(1));
}

class ScratchMain extends React.Component {
  render() {
    const Comp = getComp();
    return (
      <div>
        <h2>Pages</h2>
        <div>{components.map(x => (
          <a
            style={{ marginRight: '2em' }}
            key={x.name}
            href={`#${x.name}`}
            onClick={() => setTimeout(() => this.forceUpdate(), 10)}
          >
            {x.name}
          </a>
        ))}
        </div>
        {Comp && <h2>{Comp.name}</h2>}
        {Comp ? <Comp /> : <h2>Select a page</h2>}
      </div>
    );
  }
}

components.push(class PortalGunMultiSource extends React.Component {
  render() {
    return (
      <PortalGun>
        {(Source, Dest) => (
          <div>
            <h3>Source First</h3>
            <Source><div>first</div></Source>
            <h3>Dest</h3>
            <Dest />
            <h3>Source Second</h3>
            <Source><div>second</div></Source>
          </div>
        )}
      </PortalGun>
    );
  }
});

export default ScratchMain;
