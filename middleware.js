const { encryptPayload } = require('./encrypt');
const { decryptPayload } = require('./decrypt');
const parseJsonSafe = value => {
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch { return value; }
};
const decryptRequestMiddleware = (secretKey, options = {}) => {
  const { payloadField = 'data' } = options;
  if (!secretKey) throw new TypeError('decryptRequestMiddleware requires a secretKey.');
  return (req, res, next) => {
    const rawPayload = typeof req.body === 'object' ? req.body[payloadField] : req.body;
    if (!rawPayload) return next();
    try {
      const decryptedText = decryptPayload(rawPayload, secretKey);
      req.body = parseJsonSafe(decryptedText);
      req.decryptedPayload = decryptedText;
      next();
    } catch (error) {
      next(error);
    }
  };
};
const encryptResponseMiddleware = (secretKey, options = {}) => {
  const { payloadField = 'data', autoEncrypt = false } = options;
  if (!secretKey) throw new TypeError('encryptResponseMiddleware requires a secretKey.');
  return (req, res, next) => {
    const originalSend = res.send.bind(res);
    const originalJson = res.json.bind(res);
    const shouldEncrypt = () => req.headers['x-encrypt-response'] === '1' || autoEncrypt === true;
    res.send = body => {
      if (!shouldEncrypt()) return originalSend(body);
      const plaintext = Buffer.isBuffer(body) ? body.toString('utf8') : typeof body === 'string' ? body : JSON.stringify(body);
      return originalSend(JSON.stringify({ [payloadField]: encryptPayload(plaintext, secretKey) }));
    };
    res.json = body => {
      if (!shouldEncrypt()) return originalJson(body);
      const plaintext = typeof body === 'string' ? body : JSON.stringify(body);
      return originalJson({ [payloadField]: encryptPayload(plaintext, secretKey) });
    };
    next();
  };
};
module.exports = { decryptRequestMiddleware, encryptResponseMiddleware };
