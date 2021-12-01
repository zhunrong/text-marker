let isAnalyzerCreated = false;

module.exports = {
  devServer: {
    port: 3000,
  },
  css: {
    extract: false,
  },
  configureWebpack: (config) => {
    console.log(config.output);
    if (
      process.env.NODE_ENV === "production" &&
      config.output.libraryTarget === "umd" &&
      !isAnalyzerCreated
    ) {
      const BundleAnalyzerPlugin =
        require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
      config.plugins.push(new BundleAnalyzerPlugin());
      isAnalyzerCreated = true;
    }
  },
};
