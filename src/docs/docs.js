// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import DocsBreakpoint from './apis/DocsBreakpoint';
import DocsCtx from './apis/DocsCtx';
import DocsPortalGun from './apis/DocsPortalGun';
import pages from './pages';
import * as icons from './icons';
import './Docs.css';

type Props = {

}

const pageToDoc = {
  breakpoint: DocsBreakpoint,
  ctx: DocsCtx,
  portalgun: DocsPortalGun,
};

const urlPartsRaw = window.location.pathname.split('/');

const urlParts = urlPartsRaw.filter((x) => {
  if (!x) return false;
  if (x === 'index.html') return false;
  if (x === 'rearm') return false;
  if (x === 'docs') return false;
  return true;
});

const isHome = urlParts.length === 0;
const activePage = isHome ? null : urlParts[1] || urlParts[0];

// const getPageUrl = page => (page.absolute ? page.absolute : `/rearm/${page.path ? `docs/${page.path}` : ''}`);
const getPageUrl = page => (page.absolute ? page.absolute : `/${page.path ? `docs/${page.path}` : ''}`);

class Docs extends React.Component<Props> {
  render() {
    return (
      <div className="Docs">
        <div className="Docs__Page">
          {this.renderSidebar()}
          {isHome ? this.renderHome() : this.renderPage()}
        </div>
      </div>
    );
  }

  renderHome() {
    return (
      <div className="Docs__Content">
        <h1>Rearm</h1>
        <div>
          {`A collection of React.js abstractions for non-trivial apps`}
        </div>

        {
          // eslint-disable-next-line
          pages.map((page) => (
            <a className="Docs__Home__Link" key={page.path} href={getPageUrl(page)}>
              <span className="Docs__Home__Link__Title">
                {page.name}
              </span>
              <span className="Docs__Home__Link__Description">
                {page.description}
              </span>
            </a>
          ))
        }
      </div>
    );
  }

  renderPage() {
    if (!activePage) return null;

    if (process.env.NODE_ENV === 'development' && activePage.indexOf('scratch') === 0) {
      // eslint-disable-next-line global-require
      const SM = require('./scratch/ScratchMain');
      const el = React.createElement(SM.default ? SM.default : SM);
      return <div className="Docs__Content">{el}</div>;
    }

    const Page = pageToDoc[activePage];

    if (!Page) {
      return <h2>404 Not found</h2>;
    }
    return <div className="Docs__Content"><Page /></div>;
  }

  toggleId = `sidebar-toggle-gyn9p8jogg`;
  renderSidebar() {
    return (
      <div className="Docs__Sidebar">
        <h3 className="Docs__Sidebar__Title">
          <code>
            npm install -s <strong >rearm</strong>
          </code>
        </h3>
        <label className="Docs__Sidebar__Toggle" htmlFor={this.toggleId}>
          <icons.Hamburger />
        </label>
        <input type="checkbox" className="Docs__Sidebar__Check" id={this.toggleId} />
        <div className="Docs__Sidebar__Content">
          {this.renderLink({ path: '', name: 'Home', description: `The home page` })}
          {pages.map(page => this.renderLink(page))}
          {this.renderLink({
            absolute: `https://rearm.brigand.me`,
            path: '<github>',
            name: <React.Fragment><icons.Github /> Github</React.Fragment>,
            description: `The official github repo`,
          })}

          {process.env.NODE_ENV === 'development' && this.renderLink({
            path: 'scratch',
            name: 'Scratch',
            description: 'only exists in development',
          })}
        </div>
      </div>
    );
  }

  // eslint-disable-next-line
  renderLink(page) {
    const isActive = page.path === activePage;

    let className = `Docs__Link`;
    if (isActive) className = `${className} Docs__Link--active`;

    return (
      <a
        href={getPageUrl(page)}
        className={className}
        title={page.description}
        key={page.path}
      >
        <div className="Docs__Link__Name">
          {page.name}
        </div>
      </a>
    );
  }
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.render(<Docs />, root);
}
