const seenDevices = new Set();
const SENSITIVE_KEYS = new Set(['authorization', 'password', 'password_hash', 'token']);

function normalizeIp(ipAddress) {
  if (!ipAddress) return 'unknown-ip';
  return ipAddress.replace('::ffff:', '');
}

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return normalizeIp(forwardedFor.split(',')[0].trim());
  }

  return normalizeIp(req.socket?.remoteAddress);
}

function getPlatform(userAgent = '') {
  const value = userAgent.toLowerCase();

  if (value.includes('android')) return 'Android';
  if (value.includes('iphone')) return 'iPhone';
  if (value.includes('ipad')) return 'iPad';
  if (value.includes('windows')) return 'Windows';
  if (value.includes('mac os x') || value.includes('macintosh')) return 'macOS';
  if (value.includes('linux')) return 'Linux';

  return '';
}

function getClientName(userAgent = '') {
  const value = userAgent.toLowerCase();

  if (value.includes('postmanruntime')) return 'Postman';
  if (value.includes('okhttp')) return 'OkHttp';
  if (value.includes('axios')) return 'Axios';
  if (value.includes('curl')) return 'curl';
  if (value.includes('edg/')) return 'Edge';
  if (value.includes('chrome/')) return 'Chrome';
  if (value.includes('firefox/')) return 'Firefox';
  if (value.includes('safari/') && !value.includes('chrome/')) return 'Safari';

  return '';
}

function getExplicitDeviceName(req) {
  const headerValue = req.headers['x-device-name'];
  const namedHeader = Array.isArray(headerValue) ? headerValue[0] : headerValue;

  if (typeof namedHeader === 'string' && namedHeader.trim()) {
    return namedHeader.trim();
  }

  if (typeof req.body?.deviceName === 'string' && req.body.deviceName.trim()) {
    return req.body.deviceName.trim();
  }

  return '';
}

function getDeviceLabel(req) {
  const explicitName = getExplicitDeviceName(req);
  if (explicitName) return explicitName;

  const userAgent = req.headers['user-agent'] || '';
  const platform = getPlatform(userAgent);
  const clientName = getClientName(userAgent);

  if (platform && clientName) return `${platform} ${clientName}`;
  if (platform) return platform;
  if (clientName) return clientName;

  return 'Unknown device';
}

function createDeviceKey(req) {
  return [
    getClientIp(req),
    req.headers['user-agent'] || '',
    getExplicitDeviceName(req)
  ].join('|');
}

function shouldLogBody(req) {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
}

function sanitizeForLogging(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeForLogging);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [
      key,
      SENSITIVE_KEYS.has(key.toLowerCase()) ? '[REDACTED]' : sanitizeForLogging(entryValue)
    ])
  );
}

function serializeBody(body) {
  if (!body || typeof body !== 'object') return '';
  if (!Object.keys(body).length) return '';

  try {
    const preview = JSON.stringify(sanitizeForLogging(body));
    return preview.length > 250 ? `${preview.slice(0, 247)}...` : preview;
  } catch {
    return '[unserializable body]';
  }
}

export default function requestLogger(req, res, next) {
  const startedAt = Date.now();
  const ipAddress = getClientIp(req);
  const deviceLabel = getDeviceLabel(req);
  const deviceKey = createDeviceKey(req);
  const bodyPreview = shouldLogBody(req) ? serializeBody(req.body) : '';

  if (!seenDevices.has(deviceKey)) {
    seenDevices.add(deviceKey);
    console.log(`[DEVICE CONNECTED] ${deviceLabel} from ${ipAddress}`);
  }

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    const suffix = bodyPreview ? ` | body=${bodyPreview}` : '';

    console.log(
      `[REQUEST] ${deviceLabel} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${durationMs}ms | ip=${ipAddress}${suffix}`
    );
  });

  next();
}
