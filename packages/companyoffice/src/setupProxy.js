const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://47.114.75.184:9000',
      pathRewrite: { '^/api': '' },
    }),
  );
};