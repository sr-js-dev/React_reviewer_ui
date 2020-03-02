const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy('/server', {
      target: 'http://167.172.238.2:3000',
      // target: "http://localhost:3011",
      // target: 'https://api.vpreservations.com',
      secure: false,
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: { '^/server': '' },
    })
  );
};
