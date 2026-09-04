import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApiMiddleware } from './src/server/apiPlugin.js';
import { runMigrations, seedIfEmpty } from './src/server/db.js';

// Load local .env if available
if (fs.existsSync('.env') && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env');
  } catch (e) {
    // Ignore if already loaded or not supported
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 5001;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const apiMiddleware = createApiMiddleware();

async function startServer() {
  try {
    await runMigrations();
    await seedIfEmpty();
    console.log('✓ Cloud PostgreSQL migrations verified and seed data checked');
  } catch (err) {
    console.warn('PostgreSQL notice:', err.message);
  }

  const server = http.createServer((req, res) => {
    // 1. Handle API & SSE Endpoints
    if (req.url && req.url.startsWith('/api/')) {
      return apiMiddleware(req, res, () => {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } }));
      });
    }

    // 2. Handle Static Files from dist/
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);
    if (pathname === '/') pathname = '/index.html';
    
    let filePath = path.join(DIST_DIR, pathname);

    // Guard against directory traversal attacks
    if (!filePath.startsWith(DIST_DIR)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        
        // Cache static assets with hash in name for 1 year, others short
        if (filePath.includes('/assets/')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=3600');
        }

        res.writeHead(200, { 'Content-Type': contentType });
        return fs.createReadStream(filePath).pipe(res);
      }

      // 3. Fallback to index.html for Single Page Application (React Router)
      const spaFallback = path.join(DIST_DIR, 'index.html');
      fs.stat(spaFallback, (fallbackErr, fallbackStats) => {
        if (!fallbackErr && fallbackStats.isFile()) {
          res.writeHead(200, { 
            'Content-Type': 'text/html; charset=UTF-8',
            'Cache-Control': 'no-cache'
          });
          return fs.createReadStream(spaFallback).pipe(res);
        }

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found. Please run `npm run build` before starting production server.');
      });
    });
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🌾 FarmDirect Production Server Live`);
    console.log(`📡 URL: http://0.0.0.0:${PORT}`);
    console.log(`🗄️  Database: Neon Cloud PostgreSQL`);
    console.log(`⚡ Real-Time SSE Telemetry: ACTIVE`);
    console.log(`====================================================`);
  });
}

startServer();
