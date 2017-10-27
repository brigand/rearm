const fs = require('fs');

const html = fs.readFileSync('src/docs/index.html', 'utf-8');
const adjusted = html.replace('docs.bundle.js', 'rearm/docs.bundle.js');

fs.writeFileSync('gh-pages/index.html', adjusted);
