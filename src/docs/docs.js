// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import DocsBreakpoint from './apis/DocsBreakpoint';
import pages from './pages';
import './Docs.css';

type Props = {

}

const pageToDoc = {
  breakpoint: DocsBreakpoint,
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
      <div>
        <h1>Rearm</h1>
        <div>
          {`A collection of React.js abstractions for non-trivial apps`}
        </div>
      </div>
    );
  }

  renderPage() {
    if (!activePage) return null;

    const Page = pageToDoc[activePage];
    if (!Page) {
      return <h2>404 Not found</h2>;
    }
    return <Page />;
  }

  renderSidebar() {
    return (
      <div className="Docs__Sidebar">
        {this.renderLink({ path: null, name: 'Home', description: `The home page` })}
        {pages.map(page => this.renderLink(page))}
      </div>
    );
  }

  // eslint-disable-next-line
  renderLink(page) {
    const isActive = page.path === activePage;

    let className = `Docs__Link`;
    if (isActive) className = `${className} Docs__Link--active`;

    return (
      <a href={`/rearm/${page.path ? `docs/${page.path}` : ''}`} className={className} title={page.description}>
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
