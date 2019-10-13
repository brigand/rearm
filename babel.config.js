module.exports = (api) => {
  api.cache(true);

  const presets = ['@babel/preset-env', '@babel/preset-react', '@babel/preset-flow'];
  const plugins = [['@babel/plugin-proposal-class-properties', { loose: true }]];
  const env = {
    production: {
      plugins: ['./scripts/babel-plugin-react-no-star.js'],
    },
  };
  const ignore = [];

  return {
    presets,
    plugins,
    env,
    ignore,
  };
};
