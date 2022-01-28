process.env.VUE_APP_VERSION = require("./package.json").version;

let isAnalyzerCreated = true;
const isDev = process.env.NODE_ENV === "development";

module.exports = {
  outputDir: "docs",
  publicPath: isDev ? "/" : "/text-marker/",
  css: {
    extract: true,
  },
  configureWebpack: (config) => {
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
