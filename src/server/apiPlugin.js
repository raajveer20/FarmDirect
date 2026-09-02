import { 
  getProducts, 
  addProduct, 
  getOrders, 
  addOrder, 
  updateOrder, 
  getPayouts, 
  addPayout,
  seedIfEmpty,
  sendOtp,
  verifyOtp,
  registerUser,
  loginUser,
  verifyFarmerKyc,
  verifyGovtFarmer
} from './db.js';

export function farmDirectApiPlugin() {
  const sseClients = new Set();

  function broadcast(eventType, payload) {
    const message = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(message);
      } catch (e) {
        sseClients.delete(client);
      }
    }
  }

  function readJsonBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (e) {
          reject(e);
        }
      });
      req.on('error', reject);
    });
  }

  function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
  }

  return {
    name: 'farmdirect-postgres-api-plugin',
    async configureServer(server) {
      // Ensure seed data exists on server boot
      try {
        await seedIfEmpty();
      } catch (err) {
        console.warn('PostgreSQL seed warning (ignoring if already seeded):', err.message);
      }

      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // CORS Preflight
        if (req.method === 'OPTIONS' && url.startsWith('/api/')) {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          });
          return res.end();
        }

        // SSE Real-Time Stream (Multi-Laptop / Multi-Tab Synchronization)
        if (req.method === 'GET' && url.startsWith('/api/events')) {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
          });
          res.write(`event: CONNECTED\ndata: ${JSON.stringify({ message: "FarmDirect Real-Time Live Sync Active" })}\n\n`);
          sseClients.add(res);

          req.on('close', () => {
            sseClients.delete(res);
          });
          return;
        }

        // ================= AUTH API ENDPOINTS =================
        // POST /api/auth/otp/send
        if (req.method === 'POST' && url.startsWith('/api/auth/otp/send')) {
          try {
            const body = await readJsonBody(req);
            const result = await sendOtp(body.identifier, body.role, body.mode || 'login', body.adminId);
            return sendJson(res, 200, result);
          } catch (err) {
            return sendJson(res, 400, { message: err.message });
          }
        }

        // POST /api/auth/otp/verify
        if (req.method === 'POST' && url.startsWith('/api/auth/otp/verify')) {
          try {
            const body = await readJsonBody(req);
            const result = await verifyOtp(body.identifier, body.otp, body.role, body.name, body.adminId);
            return sendJson(res, 200, result);
          } catch (err) {
            return sendJson(res, 400, { message: err.message });
          }
        }

        // POST /api/auth/register
        if (req.method === 'POST' && url.startsWith('/api/auth/register')) {
          try {
            const body = await readJsonBody(req);
            const result = await registerUser(body);
            return sendJson(res, 201, result);
          } catch (err) {
            return sendJson(res, 400, { message: err.message });
          }
        }

        // POST /api/auth/login
        if (req.method === 'POST' && url.startsWith('/api/auth/login')) {
          try {
            const body = await readJsonBody(req);
            const result = await loginUser(body.email || body.phone || body.identifier, body.password);
            return sendJson(res, 200, result);
          } catch (err) {
            return sendJson(res, 401, { message: err.message });
          }
        }

        // POST /api/auth/verify-farmer
        if (req.method === 'POST' && url.startsWith('/api/auth/verify-farmer')) {
          try {
            const body = await readJsonBody(req);
            const result = await verifyFarmerKyc(body.identifier || body.email, body);
            return sendJson(res, 200, { success: true, message: 'Farmer KYC verified in PostgreSQL', user: result });
          } catch (err) {
            return sendJson(res, 400, { message: err.message });
          }
        }

        // POST /api/auth/verify-govt-farmer (PM-Kisan & Bhulekh Land Records Registry)
        if (req.method === 'POST' && url.startsWith('/api/auth/verify-govt-farmer')) {
          try {
            const body = await readJsonBody(req);
            const result = await verifyGovtFarmer(body);
            return sendJson(res, 200, result);
          } catch (err) {
            return sendJson(res, 403, { 
              verified: false, 
              message: err.message 
            });
          }
        }

        // GET /api/products
        if (req.method === 'GET' && url.startsWith('/api/products')) {
          try {
            const products = await getProducts();
            return sendJson(res, 200, products);
          } catch (err) {
            return sendJson(res, 500, { error: err.message });
          }
        }

        // POST /api/products (Farmer lists new produce)
        if (req.method === 'POST' && url.startsWith('/api/products')) {
          try {
            const body = await readJsonBody(req);
            const created = await addProduct(body);
            // Broadcast live to Buyer and Logistics laptops!
            broadcast('PRODUCE_ADDED', body);
            return sendJson(res, 201, created);
          } catch (err) {
            return sendJson(res, 500, { error: err.message });
          }
        }

        // GET /api/orders
        if (req.method === 'GET' && url.startsWith('/api/orders')) {
          try {
            const orders = await getOrders();
            return sendJson(res, 200, orders);
          } catch (err) {
            return sendJson(res, 500, { error: err.message });
          }
        }

        // POST /api/orders (Buyer places order & funds escrow)
        if (req.method === 'POST' && url.startsWith('/api/orders')) {
          try {
            const body = await readJsonBody(req);
            const created = await addOrder(body);
            // Broadcast live to Farmer and Logistics laptops!
            broadcast('ORDER_PLACED', body);
            return sendJson(res, 201, created);
          } catch (err) {
            return sendJson(res, 500, { error: err.message });
          }
        }

        // PATCH /api/orders/:id (Status update / Escrow Handover QR Scan)
        if (req.method === 'PATCH' && url.startsWith('/api/orders/')) {
          try {
            const id = url.replace('/api/orders/', '').split('?')[0];
            const body = await readJsonBody(req);
            const updated = await updateOrder(id, body.status, body);
            // Broadcast live to Farmer and Buyer laptops!
            broadcast('ORDER_UPDATED', { id, ...body });
            return sendJson(res, 200, updated);
          } catch (err) {
            return sendJson(res, 500, { error: err.message });
          }
        }

        // GET /api/payouts
        if (req.method === 'GET' && url.startsWith('/api/payouts')) {
          try {
            const payouts = await getPayouts();
            return sendJson(res, 200, payouts);
          } catch (err) {
            return sendJson(res, 500, { error: err.message });
          }
        }

        // POST /api/payouts (Log instant UPI payout)
        if (req.method === 'POST' && url.startsWith('/api/payouts')) {
          try {
            const body = await readJsonBody(req);
            const created = await addPayout(body);
            // Broadcast payout event to Farmer laptop!
            broadcast('PAYOUT_SETTLED', body);
            return sendJson(res, 201, created);
          } catch (err) {
            return sendJson(res, 500, { error: err.message });
          }
        }

        next();
      });
    }
  };
}
