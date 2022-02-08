module.exports = (webpackConf, type) => {
  if (type === 'lib') {
    Object.assign(webpackConf.externals, {
      '@floating-ui/dom': '@floating-ui/dom',
    });
  }
  if (type === 'build') {
    Object.assign(webpackConf.output, {
      publicPath: '/text-marker/',
    });
  }
};
