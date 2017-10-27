const { join: pathJoin } = require('path');

module.exports = {
  entry: './src/docs/docs.js',
  output: {
    filename: 'docs.bundle.js',
    path: pathJoin(__dirname, '..', '..', 'gh-pages'),
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: 'babel-loader',
        include: pathJoin(__dirname, '..'),
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    contentBase: pathJoin(__dirname),
    historyApiFallback: true,
  },
};
