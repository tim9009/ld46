module.exports = {
  publicPath: '',
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/styles/_global.scss";'
      }
    }
  }
};