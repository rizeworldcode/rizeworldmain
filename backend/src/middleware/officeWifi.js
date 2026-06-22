// Middleware to restrict clock-in and clock-out to specific company IPs
const normalizeIp = (ip) => {
  if (!ip) return '';
  let cleanIp = ip.split(',')[0].trim();

  if (cleanIp.startsWith('[') && cleanIp.endsWith(']')) {
    cleanIp = cleanIp.slice(1, -1);
  }

  cleanIp = cleanIp.split('%')[0].trim();

  if (cleanIp.startsWith('::ffff:')) {
    cleanIp = cleanIp.replace('::ffff:', '');
  }

  return cleanIp.toLowerCase();
};

const DEFAULT_OFFICE_IPS = [
  '2409:4090:a032:1c00:80c0:b395:a791:1f94'
];

const getAllowedIps = () => {
  const envIps = (process.env.OFFICE_WIFI_IP || '')
    .split(',')
    .map(ip => normalizeIp(ip.trim()))
    .filter(Boolean);

  // Always include localhost for development/admin purposes
  const localhostIps = ['::1', '127.0.0.1'];
  
  return [...new Set([...envIps, ...localhostIps, ...DEFAULT_OFFICE_IPS])];
};

const isOfficeWifi = (req) => {
  const rawClientIp =
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.headers['x-client-ip'] ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip ||
    '';

  const clientIp = normalizeIp(rawClientIp);
  const allowedIps = getAllowedIps();

  console.log('Office WiFi auth:', {
    rawClientIp,
    clientIp,
    allowedIps,
    isAllowed: allowedIps.includes(clientIp)
  });

  return allowedIps.includes(clientIp);
};

const requireOfficeWifi = (req, res, next) => {
  console.log('Checking office WiFi for request:', req.method, req.path);
  
  // For development purposes, allow all IPs if NODE_ENV is development
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Skipping office WiFi check');
    return next();
  }
  
  if (!isOfficeWifi(req)) {
    return res.status(403).json({
      success: false,
      message: 'Please connect to the company WiFi before clocking in or clocking out.'
    });
  }
  next();
};

module.exports = {
  requireOfficeWifi,
  isOfficeWifi,
  normalizeIp,
  getAllowedIps
};
