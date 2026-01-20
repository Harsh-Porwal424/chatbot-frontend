const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');
const http = require('http');

// Create custom agents with increased timeouts and IPv4 preference
const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  timeout: 120000,
  family: 4, // Force IPv4 to avoid IPv6 connection issues
});

const httpAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  timeout: 120000,
  family: 4,
});

module.exports = function(app) {
  // Proxy for chat endpoint (localhost:9000)
  app.use(
    '/chat',
    createProxyMiddleware({
      target: 'http://localhost:9000',
      changeOrigin: true,
      timeout: 30000,
      proxyTimeout: 30000,
      agent: httpAgent,
      headers: {
        'X-Bungee-Tenant': 'meijer',
        'ngrok-skip-browser-warning': 'true',
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying chat:', req.method, req.path);
        // Set socket timeout at the request level
        proxyReq.setTimeout(30000);
      },
      onError: (err, req, res) => {
        console.error('Chat proxy error:', err.message);
        res.status(504).json({ error: 'Gateway timeout', message: err.message });
      },
    })
  );

  // Proxy for other API endpoints (remote server)
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://rs-baas-cr-dev-969849849056.us-east5.run.app',
      changeOrigin: true,
      timeout: 120000, // 120 seconds timeout (increased for cold starts)
      proxyTimeout: 120000, // 120 seconds proxy timeout
      agent: httpsAgent, // Use custom agent with IPv4 and longer timeouts
      headers: {
        'X-Bungee-Tenant': 'meijer',
        'ngrok-skip-browser-warning': 'true',
      },
      onProxyReq: (proxyReq, req, res) => {
        // Log proxy requests for debugging with timestamp
        console.log(`[${new Date().toISOString()}] Proxying:`, req.method, req.path);
        // Set socket timeout at the request level
        proxyReq.setTimeout(120000);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`[${new Date().toISOString()}] Response:`, req.method, req.path, 'Status:', proxyRes.statusCode);
      },
      onError: (err, req, res) => {
        console.error(`[${new Date().toISOString()}] Proxy error for ${req.method} ${req.path}:`, err.code, err.message);
        if (!res.headersSent) {
          res.status(504).json({
            error: 'Gateway timeout',
            message: err.message,
            code: err.code,
            path: req.path,
            suggestion: err.code === 'ETIMEDOUT' ? 'Backend service may be starting up. Please retry in a moment.' : 'Please check backend service status.'
          });
        }
      },
    })
  );
};
