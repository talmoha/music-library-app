const { createProxyMiddleware } = require('http-proxy-middleware');
//file to set up the proxy server connecting the backend to the frontend
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};