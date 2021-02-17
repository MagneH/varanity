/* eslint-disable camelcase */

const path = require('path');
const client = require('varan/webpack/client');

const pwaManifest = {
  name: 'Naf - Elbilguiden',
  short_name: 'NAFPWA',
  description: 'Naf - Elbilguiden',
  background_color: '#EFEFEF',
  theme_color: '#59C3C3',
  icons: [
    {
      src: path.resolve(__dirname, '../src/assets/images/logo.png'),
      sizes: [96, 192, 512, 1024],
    },
  ],
};

// Exports
module.exports = (options) => client({ ...options, pwaManifest });
