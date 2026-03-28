import jwt from 'jsonwebtoken';

const FALLBACK_JWT_SECRET = 'phantom-load-dev-secret-change-me';
const JWT_SECRET = process.env.JWT_SECRET || FALLBACK_JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

let hasWarnedAboutFallbackSecret = false;

function warnIfUsingFallbackSecret() {
  if (!process.env.JWT_SECRET && !hasWarnedAboutFallbackSecret) {
    hasWarnedAboutFallbackSecret = true;
    console.warn('[AUTH] JWT_SECRET is not set. Using a development fallback secret.');
  }
}

export function createAuthToken(user) {
  warnIfUsingFallbackSecret();

  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyAuthToken(token) {
  warnIfUsingFallbackSecret();
  return jwt.verify(token, JWT_SECRET);
}
