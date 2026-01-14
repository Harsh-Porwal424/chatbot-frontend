const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://rs-baas-cr-dev-969849849056.us-east5.run.app',
      changeOrigin: true,
      headers: {
        'X-Bungee-Tenant': 'meijer',
        'ngrok-skip-browser-warning': 'true',
      },
      onProxyReq: (proxyReq, req, res) => {
        // Log proxy requests for debugging
        console.log('Proxying:', req.method, req.path);
      },
    })
  );
};
