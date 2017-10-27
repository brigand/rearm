const fs = require('fs');
const mkdirp = require('mkdirp');
const pages = require('../src/docs/pages');

const html = fs.readFileSync('src/docs/index.html', 'utf-8');
const adjusted = html.replace('docs.bundle.js', 'rearm/docs.bundle.js');

mkdirp.sync('gh-pages');
mkdirp.sync('gh-pages/docs');

// main html page
fs.writeFileSync('gh-pages/index.html', adjusted);

pages.forEach((page) => {
  mkdirp.sync(`gh-pages/docs/${page.path}`);
  fs.writeFileSync(`gh-pages/docs/${page.path}/index.html`, adjusted);
});
