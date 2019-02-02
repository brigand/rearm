const fs = require('fs');
const mkdirp = require('mkdirp');
const pages = require('../src/docs/pages');

const buildId = Math.floor(Math.random() * 2**45);
const html = fs.readFileSync('src/docs/index.html', 'utf-8');
const adjusted = html.replace('docs.bundle.js', 'rearm/docs.bundle.js?' + buildId).replace('rearm-icon.png', 'rearm/rearm-icon.png');

mkdirp.sync('docs-pub');
mkdirp.sync('docs-pub/docs');

// main html page
fs.writeFileSync('docs-pub/index.html', adjusted);

pages.forEach((page) => {
  mkdirp.sync(`docs-pub/docs/${page.path}`);
  fs.writeFileSync(`docs-pub/docs/${page.path}/index.html`, adjusted);
});
