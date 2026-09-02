/**
 * FarmDirect Authentication & Authorization Module
 * 
 * - JWT signing/verification using Node.js crypto (HMAC-SHA256)
 * - Password hashing using Node.js crypto (scrypt)
 * - OTP rate limiting (in-memory)
 * - Role-based authorization
 * 
 * Zero external dependencies for core auth operations.
 */
import crypto from 'crypto';

// ─── Configuration ──────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'farmdirect-change-me-in-production';
const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || '86400', 10); // 24h in seconds
const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);
const OTP_RATE_LIMIT_MAX = 5;        // max OTP requests per window
const OTP_RATE_LIMIT_WINDOW = 600;   // 10 minutes in seconds
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

// ─── JWT ────────────────────────────────────────────────────────────────────

function base64UrlEncode(data) {
  return Buffer.from(data).toString('base64url');
}

function base64UrlDecode(str) {
  return Buffer.from(str, 'base64url').toString('utf-8');
}

/**
 * Generate a signed JWT token for an authenticated user.
 * @param {{ id: number, role: string, email?: string }} user
 * @returns {string} JWT token string
 */
export function generateToken(user) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id,
    role: user.role,
    email: user.email || null,
    iat: now,
    exp: now + JWT_EXPIRES_IN,
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url');

  return `${headerB64}.${payloadB64}.${signature}`;
}

/**
 * Verify and decode a JWT token.
 * @param {string} token
 * @returns {{ sub: number, role: string, email?: string, iat: number, exp: number }}
 * @throws {Error} if token is invalid or expired
 */
export function verifyToken(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Authentication token is required');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  const [headerB64, payloadB64, signature] = parts;

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new Error('Invalid token signature');
  }

  // Decode payload
  const payload = JSON.parse(base64UrlDecode(payloadB64));

  // Check expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    throw new Error('Token has expired. Please log in again.');
  }

  return payload;
}

/**
 * Extract and verify JWT from request Authorization header.
 * @param {import('http').IncomingMessage} req
 * @returns {{ sub: number, role: string, email?: string }} decoded payload
 * @throws {Error} if no token or invalid
 */
export function authenticateRequest(req) {
  const authHeader = req.headers?.authorization || req.headers?.Authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Authentication required. Please log in.');
  }
  const token = authHeader.slice(7).trim();
  return verifyToken(token);
}

/**
 * Check if the authenticated user has one of the required roles.
 * @param {{ role: string }} authPayload - decoded JWT payload
 * @param {string[]} allowedRoles - e.g. ['FARMER', 'ADMIN']
 * @throws {Error} if role is not allowed
 */
export function requireRole(authPayload, ...allowedRoles) {
  const userRole = (authPayload.role || '').toUpperCase().replace(/\s+/g, '_');
  const normalizedAllowed = allowedRoles.map(r => r.toUpperCase().replace(/\s+/g, '_'));
  
  // Handle the "Logistics / Admin" → "LOGISTICS_/_ADMIN" normalization
  const matches = normalizedAllowed.some(allowed => {
    if (userRole === allowed) return true;
    if (userRole.includes('LOGISTICS') && allowed.includes('LOGISTICS')) return true;
    if (userRole.includes('ADMIN') && allowed.includes('ADMIN')) return true;
    if (userRole === 'FARMER' && allowed === 'FARMER') return true;
    if (userRole === 'BUYER' && allowed === 'BUYER') return true;
    return false;
  });

  if (!matches) {
    throw new Error(`Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${authPayload.role}`);
  }
}

// ─── Password Hashing ───────────────────────────────────────────────────────

/**
 * Hash a password using scrypt.
 * @param {string} plaintext
 * @returns {string} hash in format "salt:hash"
 */
export function hashPassword(plaintext) {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto.scryptSync(plaintext, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a plaintext password against a stored hash.
 * @param {string} plaintext
 * @param {string} stored - hash in format "salt:hash"
 * @returns {boolean}
 */
export function verifyPassword(plaintext, stored) {
  if (!stored || !stored.includes(':')) {
    // Legacy plaintext comparison for migration (passwords stored before hashing was added)
    // Accept 'otp_authenticated' as a valid marker for OTP-only accounts
    if (stored === 'otp_authenticated') return true;
    return stored === plaintext;
  }
  const [salt, hash] = stored.split(':');
  const derived = crypto.scryptSync(plaintext, salt, KEY_LENGTH).toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
  } catch {
    return false;
  }
}

// ─── OTP Rate Limiter ───────────────────────────────────────────────────────
const otpAttempts = new Map(); // key: identifier, value: { count, firstAttemptTime }

/**
 * Check if an OTP request should be rate-limited.
 * @param {string} identifier - phone or email
 * @throws {Error} if rate limit exceeded
 */
export function checkOtpRateLimit(identifier) {
  const key = identifier.toLowerCase().trim();
  const now = Date.now();
  const entry = otpAttempts.get(key);

  if (entry) {
    const elapsed = (now - entry.firstAttemptTime) / 1000;
    if (elapsed < OTP_RATE_LIMIT_WINDOW) {
      if (entry.count >= OTP_RATE_LIMIT_MAX) {
        const remainingSec = Math.ceil(OTP_RATE_LIMIT_WINDOW - elapsed);
        throw new Error(`Too many OTP requests. Please wait ${remainingSec} seconds before trying again.`);
      }
      entry.count++;
    } else {
      // Reset window
      otpAttempts.set(key, { count: 1, firstAttemptTime: now });
    }
  } else {
    otpAttempts.set(key, { count: 1, firstAttemptTime: now });
  }
}

/**
 * Get OTP expiry time in minutes.
 * @returns {number}
 */
export function getOtpExpiryMinutes() {
  return OTP_EXPIRY_MINUTES;
}

// ─── Aadhaar Masking ────────────────────────────────────────────────────────

/**
 * Mask an Aadhaar number, showing only last 4 digits.
 * Input: "9823-4512-6701" → "XXXX-XXXX-6701"
 * Input: "982345126701" → "XXXX-XXXX-6701"
 * @param {string} aadhaar
 * @returns {string} masked
 */
export function maskAadhaar(aadhaar) {
  if (!aadhaar) return null;
  const digits = aadhaar.replace(/[^0-9]/g, '');
  if (digits.length < 4) return 'XXXX-XXXX-XXXX';
  const last4 = digits.slice(-4);
  return `XXXX-XXXX-${last4}`;
}

/**
 * Sanitize a user object for API responses — removes sensitive fields.
 * @param {object} user - raw user DB row
 * @param {boolean} isSelf - if true, shows slightly more info
 * @returns {object} safe user object
 */
export function sanitizeUser(user, isSelf = false) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    location: user.location,
    verificationStatus: user.verification_status,
    fpoName: user.fpo_name,
    bankUpiId: isSelf ? user.bank_upi_id : undefined,
    farmerId: user.farmer_id,
    aadhaarId: maskAadhaar(user.aadhaar_id),
    kccNumber: user.kcc_number,
    landSizeAcres: user.land_size_acres ? Number(user.land_size_acres) : undefined,
    primaryCrops: user.primary_crops,
    buyerType: user.buyer_type,
    businessName: user.business_name,
    isLoggedIn: true,
  };
}

// ─── Input Validation Helpers ───────────────────────────────────────────────

/**
 * Validate phone number format (Indian mobile).
 * Accepts: 9876543210, +919876543210, +91 98765 43210
 * @param {string} phone
 * @returns {string} normalized 10-digit phone
 * @throws {Error} if invalid
 */
export function validatePhone(phone) {
  if (!phone) throw new Error('Phone number is required');
  const digits = phone.replace(/[^0-9]/g, '');
  const tenDigit = digits.slice(-10);
  if (tenDigit.length !== 10 || !/^[6-9]/.test(tenDigit)) {
    throw new Error('Invalid Indian mobile number. Must be a valid 10-digit number starting with 6-9.');
  }
  return tenDigit;
}

/**
 * Validate email format.
 * @param {string} email
 * @returns {string} lowercased email
 * @throws {Error} if invalid
 */
export function validateEmail(email) {
  if (!email) throw new Error('Email is required');
  const clean = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    throw new Error('Invalid email format');
  }
  return clean;
}

// Cleanup stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of otpAttempts) {
    if ((now - entry.firstAttemptTime) / 1000 > OTP_RATE_LIMIT_WINDOW * 2) {
      otpAttempts.delete(key);
    }
  }
}, 300_000);
