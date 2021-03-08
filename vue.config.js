/* eslint @typescript-eslint/no-var-requires: 0 */
const glob = require('glob');
const titles = require('./src/pages/title.config.js');
const pages = {};

glob.sync('./src/pages/**/app.ts').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/app.ts')[0];
  pages[chunk] = {
    entry: path,
    template: 'public/index.html',
    filename: `${chunk}.html`,
    title: titles[chunk],
    chunks: ['chunk-vendors', 'chunk-common', chunk]
  };
});

module.exports = {
  pages,
  devServer: {
    port: 3000,
    disableHostCheck: true,
    open: true
  }
};
