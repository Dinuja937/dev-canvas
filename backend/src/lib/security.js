import crypto from 'crypto';

const isProduction = process.env.NODE_ENV === 'production';

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set to a value of at least 32 characters');
  }
  return secret;
};

export const assertRequiredSecurityConfig = () => {
  if (isProduction) {
    getJwtSecret();
    if (!process.env.CLIENT_URL || !process.env.SERVER_URL) {
      throw new Error('CLIENT_URL and SERVER_URL must be configured in production');
    }
  }
};

export const createOidcState = () => crypto.randomBytes(32).toString('base64url');
export const createPkceVerifier = () => crypto.randomBytes(48).toString('base64url');
export const createPkceChallenge = (verifier) => crypto
  .createHash('sha256')
  .update(verifier)
  .digest('base64url');

export const safeEqual = (left, right) => {
  if (typeof left !== 'string' || typeof right !== 'string') return false;
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

export const securityLog = (event, details = {}) => {
  // Deliberately accept only non-sensitive metadata. Never log request bodies or credentials.
  console.info(JSON.stringify({ event, ...details, timestamp: new Date().toISOString() }));
};
