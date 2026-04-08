const { createDecipheriv } = require('crypto');
const { ALGORITHM, IV_LENGTH, ENCODING, TEXT_ENCODING, normalizeKey } = require('./encrypt');

const decryptPayload = (payload, secretKey) => {
  const key = normalizeKey(secretKey);
  const parts = String(payload).split(':');
  if (parts.length !== 3) throw new Error('Payload is malformed. Expected iv:ciphertext:authTag.');
  const [ivEncoded, ciphertextEncoded, authTagEncoded] = parts;
  const iv = Buffer.from(ivEncoded, ENCODING);
  if (iv.length !== IV_LENGTH) throw new Error('Invalid IV length.');
  const ciphertext = Buffer.from(ciphertextEncoded, ENCODING);
  const authTag = Buffer.from(authTagEncoded, ENCODING);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(TEXT_ENCODING);
};

module.exports = { decryptPayload };
