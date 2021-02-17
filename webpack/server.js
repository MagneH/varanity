const server = require('varan/webpack/server');

// Exports
module.exports = (options) => {
  if (process.env.DANGEROUSLY_SKIP_HOST_CHECK === 'true') {
    return server({ ...options }, { devServer: { host: '0.0.0.0', disableHostCheck: true } });
  }
  return server({ ...options }, { devServer: { host: '0.0.0.0', disableHostCheck: true } });
};
