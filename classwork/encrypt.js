const { randomBytes, createCipheriv } = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const KEY_LENGTH = 32;
const ENCODING = 'base64';
const TEXT_ENCODING = 'utf8';

const normalizeKey = secretKey => {
  if (!secretKey) throw new TypeError('A 32-byte secret key is required.');
  if (typeof secretKey === 'string') secretKey = Buffer.from(secretKey, ENCODING);
  if (!Buffer.isBuffer(secretKey) || secretKey.length !== KEY_LENGTH) throw new TypeError('Secret key must be a 32-byte Buffer or base64 string.');
  return secretKey;
};

const generateSecretKey = () => randomBytes(KEY_LENGTH).toString(ENCODING);

const encryptPayload = (plaintext, secretKey) => {
  const key = normalizeKey(secretKey);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, TEXT_ENCODING), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString(ENCODING), ciphertext.toString(ENCODING), authTag.toString(ENCODING)].join(':');
};

module.exports = { ALGORITHM, IV_LENGTH, KEY_LENGTH, ENCODING, TEXT_ENCODING, generateSecretKey, normalizeKey, encryptPayload };
