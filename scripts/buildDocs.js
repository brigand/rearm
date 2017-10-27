const fs = require('fs');

const html = fs.readFileSync('src/docs/index-gh.html', 'utf-8');

fs.writeFileSync('gh-pages/index.html', html);
