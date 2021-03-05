module.exports = {
  devServer: {
    port: 3000,
    disableHostCheck: true,
    open: true
  },
  pages: {
    about: {
      entry: "./src/pages/about/app.ts",
      template: "public/index.html",
      filename: "about.html",
      title: "About Page",
      chunks: ["chunk-vendors", "chunk-common", "about"]
    },
    index: {
      entry: "./src/pages/index/app.ts",
      template: "public/index.html",
      filename: "index.html",
      title: "Index Page",
      chunks: ["chunk-vendors", "chunk-common", "index"]
    }
  }
};
