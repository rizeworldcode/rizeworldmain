/**
 * Middleware to restrict clock-in/clock-out to office WiFi IPs.
 *
 * Set environment variables:
 *   OFFICE_WIFI_IPS   — comma-separated exact IPs or CIDR/prefix ranges
 *                       Example: "192.168.1.0/24,2409:4090:a032:1c00::/64"
 *   NODE_ENV          — set to "development" to skip the check locally
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Normalize a raw IP string:
 *  - Takes the first IP in an x-forwarded-for chain
 *  - Strips IPv6 zone IDs (%eth0)
 *  - Unwraps bracket notation ([::1] -> ::1)
 *  - Strips IPv4-mapped prefix (::ffff:1.2.3.4 -> 1.2.3.4)
 *  - Lowercases for consistent comparison
 */
const normalizeIp = (ip) => {
  if (!ip) return '';
  let clean = ip.split(',')[0].trim();
  if (clean.startsWith('[') && clean.endsWith(']')) clean = clean.slice(1, -1);
  clean = clean.split('%')[0].trim();
  if (clean.startsWith('::ffff:')) clean = clean.slice(7);
  return clean.toLowerCase();
};

/**
 * Convert an IPv4 address string to a 32-bit unsigned integer.
 */
const ipv4ToInt = (ip) =>
  ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;

/**
 * Check whether an IPv4 address falls inside a CIDR block (e.g. 192.168.1.0/24).
 */
const ipv4InCidr = (ip, cidr) => {
  const [base, bits] = cidr.split('/');
  const mask = bits ? (~0 << (32 - parseInt(bits, 10))) >>> 0 : 0xffffffff;
  return (ipv4ToInt(ip) & mask) === (ipv4ToInt(base) & mask);
};

/**
 * Expand a (possibly compressed) IPv6 address to 32 hex characters.
 * Handles '::' compression.
 */
const expandIpv6 = (ip) => {
  const halves = ip.split('::');
  const left  = halves[0] ? halves[0].split(':') : [];
  const right = halves[1] ? halves[1].split(':') : [];
  const missing = 8 - left.length - right.length;
  const middle = Array(Math.max(0, missing)).fill('0000');
  return [...left, ...middle, ...right].map((g) => g.padStart(4, '0')).join('');
};

/**
 * Check whether an IPv6 address falls inside a prefix (e.g. 2409:4090:a032:1c00::/64).
 */
const ipv6InPrefix = (ip, prefix) => {
  const [base, bits] = prefix.split('/');
  const prefixLen = bits ? parseInt(bits, 10) : 128;
  const hexChars = Math.ceil(prefixLen / 4);
  return expandIpv6(ip).slice(0, hexChars) === expandIpv6(base).slice(0, hexChars);
};

/**
 * Return true if `ip` matches `rule`, where rule may be:
 *   - An exact IP            "192.168.1.5"
 *   - An IPv4 CIDR           "192.168.1.0/24"
 *   - An IPv6 prefix         "2409:4090:a032:1c00::/64"
 */
const ipMatchesRule = (ip, rule) => {
  if (rule.includes('/')) {
    return rule.includes(':') ? ipv6InPrefix(ip, rule) : ipv4InCidr(ip, rule);
  }
  return ip === normalizeIp(rule);
};

// ---------------------------------------------------------------------------
// Allowed-rule list (built from environment variables)
// ---------------------------------------------------------------------------

/**
 * Returns the list of allowed IP rules.
 * Localhost entries are always included for dev/admin tooling.
 *
 * Add your office WiFi range to .env:
 *   OFFICE_WIFI_IPS=2409:4090:a032:1c00::/64,192.168.10.0/24
 */
const getAllowedRules = () => {
  const envRules = (process.env.OFFICE_WIFI_IPS || '')
    .split(',')
    .map((r) => r.trim().toLowerCase())
    .filter(Boolean);

  const localhostRules = ['::1', '127.0.0.1'];

  return [...new Set([...localhostRules, ...envRules])];
};

// ---------------------------------------------------------------------------
// Core check
// ---------------------------------------------------------------------------

/**
 * Extract the real client IP from a request, checking common proxy headers.
 */
const extractClientIp = (req) => {
  const raw =
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip']       ||
    req.headers['x-client-ip']     ||
    req.socket?.remoteAddress      ||
    req.connection?.remoteAddress  ||
    req.ip                         ||
    '';
  return normalizeIp(raw);
};

/**
 * Returns true when the request comes from an allowed office IP or range.
 */
const isOfficeWifi = (req) => {
  const clientIp = extractClientIp(req);
  const rules    = getAllowedRules();
  const allowed  = rules.some((rule) => ipMatchesRule(clientIp, rule));

  console.log('[officeWifi]', { clientIp, rules, allowed });

  return allowed;
};

// ---------------------------------------------------------------------------
// Express middleware
// ---------------------------------------------------------------------------

const requireOfficeWifi = (req, res, next) => {
  // Skip check in local development so engineers can test without the office network
  if (process.env.NODE_ENV === 'development') {
    console.log('[officeWifi] development mode — WiFi check skipped');
    return next();
  }

  if (!isOfficeWifi(req)) {
    return res.status(403).json({
      success: false,
      message: 'You must be connected to the company WiFi to clock in or clock out.',
    });
  }

  next();
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  requireOfficeWifi,
  isOfficeWifi,
  normalizeIp,
  getAllowedRules,
  // Exposed for unit tests
  ipMatchesRule,
  ipv4InCidr,
  ipv6InPrefix,
};
