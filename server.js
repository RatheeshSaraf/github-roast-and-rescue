import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleGithubProxy } from './apiProxy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 8080;

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split('?')[0];

  // 1. Intercept Server-side GitHub API Proxy routes
  if (urlPath.startsWith('/api/github')) {
    await handleGithubProxy(req, res);
    return;
  }

  // 2. Health check route
  if (urlPath === '/healthz' || urlPath === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'github-roast-and-rescue' }));
    return;
  }

  // 3. Serve static assets & SPA fallback
  let filePath = path.join(distDir, urlPath === '/' ? 'index.html' : urlPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
    } else {
      if (ext === '.html') {
        res.setHeader('Cache-Control', 'no-cache');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Cloud Run container active on port ${PORT}`);
  if (process.env.GITHUB_TOKEN) {
    console.log('GitHub API Proxy initialized with authenticated GITHUB_TOKEN (5,000 req/hr)');
  } else {
    console.log('GitHub API Proxy running in unauthenticated mode (set GITHUB_TOKEN env var for 5k req/hr)');
  }
});
