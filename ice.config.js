const path = require('path');
module.exports = {
  entry: 'src/index.js',
  publicPath: './',
	alias: {
    '@root': path.resolve(__dirname, 'src/')
  },
  plugins: [
    ['ice-plugin-fusion', {
      theme: '@icedesign/theme',
    }],
    ['ice-plugin-moment-locales', {
      locales: ['zh-cn'],
    }],
  ],
};
