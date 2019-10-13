module.exports = {
  title: 'Rearm',
  base: '/',
  menu: ['Getting Started', 'Installation', 'Components'],
  openBrowser: false,
  typescript: true,
  modifyBundlerConfig: (config) => {
    config.module.rules.unshift({ test: /\.tsx/, loader: 'ts-loader' });
  },
};
