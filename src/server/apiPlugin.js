/**
 * FarmDirect — Vite API Plugin (Hardened)
 *
 * All API endpoints with authentication, authorization,
 * proper HTTP status codes, and consistent error responses.
 */
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  createOrder,
  updateOrder,
  confirmDelivery,
  getPayouts,
  getAdminStats,
  getForecast,
  getRouteOptimization,
  runMigrations,
  seedIfEmpty,
  sendOtp,
  verifyOtp,
  registerUser,
  loginUser,
  verifyFarmerKyc,
  verifyGovtFarmer,
} from './db.js';

import {
  authenticateRequest,
  requireRole,
} from './auth.js';

export function createApiMiddleware() {
  const sseClients = new Map(); // Map<res, { userId, role }>

  function broadcast(eventType, payload, targetRole = null) {
    const message = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
    for (const [client, meta] of sseClients) {
      try {
        if (targetRole && meta.role && !meta.role.toUpperCase().includes(targetRole.toUpperCase())) {
          continue;
        }
        client.write(message);
      } catch (e) {
        sseClients.delete(client);
      }
    }
  }

  // Heartbeat every 30 seconds (unref'd so it does not keep process alive)
  const heartbeatTimer = setInterval(() => {
    const heartbeat = `: heartbeat ${Date.now()}\n\n`;
    for (const [client] of sseClients) {
      try {
        client.write(heartbeat);
      } catch (e) {
        sseClients.delete(client);
      }
    }
  }, 30000);
  if (heartbeatTimer.unref) {
    heartbeatTimer.unref();
  }

  function readJsonBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (e) {
          reject(new Error('Invalid JSON in request body'));
        }
      });
      req.on('error', reject);
    });
  }

  const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

  function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': CORS_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end(JSON.stringify(data));
  }

  function sendError(res, statusCode, code, message) {
    sendJson(res, statusCode, {
      success: false,
      error: { code, message },
    });
  }

  /**
   * Try to authenticate the request. Returns auth payload or null.
   * Does NOT throw — use for optional auth.
   */
  function tryAuth(req) {
    try {
      return authenticateRequest(req);
    } catch {
      return null;
    }
  }

  /**
   * Require authentication. Returns auth payload or sends 401.
   */
  function requireAuth(req, res) {
    try {
      return authenticateRequest(req);
    } catch (err) {
      sendError(res, 401, 'UNAUTHORIZED', err.message);
      return null;
    }
  }

  /**
   * Require authentication + role. Returns auth payload or sends 401/403.
   */
  function requireAuthWithRole(req, res, ...roles) {
    const auth = requireAuth(req, res);
    if (!auth) return null;
    try {
      requireRole(auth, ...roles);
      return auth;
    } catch (err) {
      sendError(res, 403, 'FORBIDDEN', err.message);
      return null;
    }
  }

  // URL parameter extraction helper
  function extractParam(url, prefix) {
    const path = url.split('?')[0];
    const after = path.slice(prefix.length);
    return after.split('/')[0];
  }

  return async function apiMiddleware(req, res, next) {
        const rawUrl = req.url || '';
        const url = rawUrl.split('?')[0];
        const queryString = rawUrl.includes('?') ? rawUrl.split('?')[1] : '';
        const params = new URLSearchParams(queryString);

        // CORS Preflight
        if (req.method === 'OPTIONS' && rawUrl.startsWith('/api/')) {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': CORS_ORIGIN,
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          });
          return res.end();
        }

        // ═══════════════════════════════════════════════════════════
        // SSE Real-Time Stream
        // ═══════════════════════════════════════════════════════════
        if (req.method === 'GET' && url === '/api/events') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': CORS_ORIGIN,
          });
          res.write(`event: CONNECTED\ndata: ${JSON.stringify({ message: "FarmDirect Real-Time Sync Active" })}\n\n`);

          const auth = tryAuth(req);
          sseClients.set(res, { userId: auth?.sub, role: auth?.role });

          req.on('close', () => {
            sseClients.delete(res);
          });
          return;
        }

        try {
          // ═══════════════════════════════════════════════════════════
          // AUTH ENDPOINTS (Public)
          // ═══════════════════════════════════════════════════════════

          if (req.method === 'POST' && url === '/api/auth/otp/send') {
            const body = await readJsonBody(req);
            const result = await sendOtp(body.identifier, body.role, body.mode || 'login', body.adminId);
            return sendJson(res, 200, result);
          }

          if (req.method === 'POST' && url === '/api/auth/otp/verify') {
            const body = await readJsonBody(req);
            const result = await verifyOtp(body.identifier, body.otp, body.role, body.name, body.adminId);
            return sendJson(res, 200, result);
          }

          if (req.method === 'POST' && url === '/api/auth/register') {
            const body = await readJsonBody(req);
            const result = await registerUser(body);
            return sendJson(res, 201, result);
          }

          if (req.method === 'POST' && url === '/api/auth/login') {
            const body = await readJsonBody(req);
            const result = await loginUser(body.email || body.phone || body.identifier, body.password);
            return sendJson(res, 200, result);
          }

          if (req.method === 'POST' && url === '/api/auth/verify-farmer') {
            const body = await readJsonBody(req);
            const result = await verifyFarmerKyc(body.identifier || body.email, body);
            return sendJson(res, 200, { success: true, message: 'Farmer KYC verified', user: result });
          }

          if (req.method === 'POST' && url === '/api/auth/verify-govt-farmer') {
            const body = await readJsonBody(req);
            const result = await verifyGovtFarmer(body);
            return sendJson(res, 200, result);
          }

          // ═══════════════════════════════════════════════════════════
          // PRODUCTS (Public read, Auth for write)
          // ═══════════════════════════════════════════════════════════

          if (req.method === 'GET' && url === '/api/products') {
            const result = await getProducts({
              category: params.get('category'),
              search: params.get('search'),
              state: params.get('state'),
              grade: params.get('grade'),
              organic: params.get('organic'),
              maxPrice: params.get('maxPrice'),
              sort: params.get('sort'),
              page: params.get('page'),
              limit: params.get('limit'),
            });
            return sendJson(res, 200, result);
          }

          if (req.method === 'GET' && url.startsWith('/api/products/')) {
            const id = extractParam(rawUrl, '/api/products/');
            const product = await getProductById(id);
            if (!product) return sendError(res, 404, 'NOT_FOUND', 'Product not found');
            return sendJson(res, 200, product);
          }

          if (req.method === 'POST' && url === '/api/products') {
            const auth = requireAuthWithRole(req, res, 'FARMER');
            if (!auth) return;
            const body = await readJsonBody(req);
            const created = await addProduct(body, auth);
            broadcast('PRODUCE_ADDED', created);
            return sendJson(res, 201, created);
          }

          if (req.method === 'PATCH' && url.startsWith('/api/products/')) {
            const auth = requireAuthWithRole(req, res, 'FARMER');
            if (!auth) return;
            const id = extractParam(rawUrl, '/api/products/');
            const body = await readJsonBody(req);
            const updated = await updateProduct(id, body, auth);
            return sendJson(res, 200, updated);
          }

          if (req.method === 'DELETE' && url.startsWith('/api/products/')) {
            const auth = requireAuthWithRole(req, res, 'FARMER');
            if (!auth) return;
            const id = extractParam(rawUrl, '/api/products/');
            const result = await deleteProduct(id, auth);
            return sendJson(res, 200, result);
          }

          // ═══════════════════════════════════════════════════════════
          // ORDERS (Auth required)
          // ═══════════════════════════════════════════════════════════

          if (req.method === 'GET' && url === '/api/orders') {
            const auth = tryAuth(req);
            const orders = await getOrders(auth);
            return sendJson(res, 200, orders);
          }

          if (req.method === 'POST' && url === '/api/orders') {
            const auth = requireAuth(req, res);
            if (!auth) return;
            const body = await readJsonBody(req);
            const created = await createOrder(body, auth);
            broadcast('ORDER_PLACED', created);
            return sendJson(res, 201, created);
          }

          if (req.method === 'POST' && url.match(/^\/api\/orders\/[^/]+\/confirm-delivery$/)) {
            const auth = requireAuth(req, res);
            if (!auth) return;
            const orderId = url.split('/')[3];
            const result = await confirmDelivery(orderId, auth);
            broadcast('ORDER_UPDATED', { id: orderId, status: 'DELIVERY_CONFIRMED', escrowSettled: true });
            if (result.payout) {
              broadcast('PAYOUT_SETTLED', result.payout);
            }
            broadcast('ESCROW_UPDATED', { orderId, status: 'RELEASED' });
            return sendJson(res, 200, result);
          }

          if (req.method === 'PATCH' && url.startsWith('/api/orders/')) {
            const auth = tryAuth(req);
            const id = extractParam(rawUrl, '/api/orders/');
            const body = await readJsonBody(req);
            const updated = await updateOrder(id, body.status, body, auth);
            broadcast('ORDER_UPDATED', { id, ...body });
            return sendJson(res, 200, updated);
          }

          // ═══════════════════════════════════════════════════════════
          // PAYOUTS (Auth required)
          // ═══════════════════════════════════════════════════════════

          if (req.method === 'GET' && url === '/api/payouts') {
            const auth = tryAuth(req);
            const payouts = await getPayouts(auth);
            return sendJson(res, 200, payouts);
          }

          // Legacy payout creation (for backward compatibility during transition)
          if (req.method === 'POST' && url === '/api/payouts') {
            const body = await readJsonBody(req);
            const { addPayout } = await import('./db.js');
            const created = await addPayout(body);
            broadcast('PAYOUT_SETTLED', body);
            return sendJson(res, 201, created);
          }

          // ═══════════════════════════════════════════════════════════
          // ADMIN STATS (Auth: ADMIN/LOGISTICS)
          // ═══════════════════════════════════════════════════════════

          if (req.method === 'GET' && url === '/api/admin/stats') {
            const auth = tryAuth(req); // Allow without auth for hackathon demo
            const stats = await getAdminStats();
            return sendJson(res, 200, stats);
          }

          // ═══════════════════════════════════════════════════════════
          // AI DEMAND FORECAST
          // ═══════════════════════════════════════════════════════════

          if (req.method === 'GET' && url === '/api/forecast') {
            const auth = tryAuth(req);
            const crop = params.get('crop') || 'Tomato';
            const region = params.get('region') || 'Central India';
            const forecast = await getForecast(crop, region);
            return sendJson(res, 200, forecast);
          }

          // ═══════════════════════════════════════════════════════════
          // ROUTE OPTIMIZATION
          // ═══════════════════════════════════════════════════════════

          if (req.method === 'GET' && url === '/api/route-optimization') {
            const result = await getRouteOptimization();
            return sendJson(res, 200, result);
          }

        } catch (err) {
          console.error(`❌ API Error [${req.method} ${rawUrl}]:`, err.message);

          // Determine status code from error message patterns
          let status = 500;
          let code = 'INTERNAL_ERROR';
          const msg = err.message || 'Internal server error';

          if (msg.includes('Access Denied') || msg.includes('not registered')) {
            status = 403; code = 'FORBIDDEN';
          } else if (msg.includes('not found') || msg.includes('NOT_FOUND')) {
            status = 404; code = 'NOT_FOUND';
          } else if (msg.includes('Insufficient inventory')) {
            status = 409; code = 'INSUFFICIENT_INVENTORY';
          } else if (msg.includes('Invalid') || msg.includes('required') || msg.includes('must be')) {
            status = 400; code = 'VALIDATION_ERROR';
          } else if (msg.includes('already exists') || msg.includes('duplicate') || msg.includes('Duplicate')) {
            status = 409; code = 'CONFLICT';
          } else if (msg.includes('Invalid status transition')) {
            status = 422; code = 'INVALID_TRANSITION';
          } else if (msg.includes('expired') || msg.includes('Authentication')) {
            status = 401; code = 'UNAUTHORIZED';
          } else if (msg.includes('Too many')) {
            status = 429; code = 'RATE_LIMITED';
          }

          return sendError(res, status, code, msg);
        }
        next();
  };
}

export function farmDirectApiPlugin() {
  const middleware = createApiMiddleware();
  return {
    name: 'farmdirect-api-plugin',
    async configureServer(server) {
      try {
        await runMigrations();
        await seedIfEmpty();
      } catch (err) {
        console.warn('⚠️ DB setup warning:', err.message);
      }
      server.middlewares.use(middleware);
    },
    async configurePreviewServer(server) {
      try {
        await runMigrations();
        await seedIfEmpty();
      } catch (err) {
        console.warn('⚠️ DB setup warning:', err.message);
      }
      server.middlewares.use(middleware);
    }
  };
}
