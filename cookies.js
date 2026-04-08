// Cookie utilities and helpers for session-based authentication

/**
 * Set a secure cookie with sensible defaults
 * @param {Response} res - Express response object
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} maxAge - Max age in milliseconds (default: 24 hours)
 * @param {boolean} secure - Force HTTPS only (default: production mode)
 */
const setCookie = (res, name, value, maxAge = 1000 * 60 * 60 * 24, secure = process.env.NODE_ENV === 'production') => {
  res.cookie(name, value, {
    maxAge,
    httpOnly: true, // Prevents JS from accessing the cookie
    secure, // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    path: '/'
  });
};

/**
 * Get cookie value from request
 * @param {Request} req - Express request object
 * @param {string} name - Cookie name
 * @returns {string|undefined} Cookie value
 */
const getCookie = (req, name) => {
  return req.cookies ? req.cookies[name] : undefined;
};

/**
 * Remove cookie by setting maxAge to 0
 * @param {Response} res - Express response object
 * @param {string} name - Cookie name
 */
const removeCookie = (res, name) => {
  res.clearCookie(name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
};

/**
 * Check if tracking cookie exists (for monitoring user activity)
 * @param {Request} req - Express request object
 * @returns {boolean} True if tracking cookie exists
 */
const hasTrackingCookie = (req) => {
  return !!getCookie(req, 'tracking_id');
};

/**
 * Set tracking cookie to monitor user sessions
 * @param {Response} res - Express response object
 * @param {string} trackingId - Unique tracking ID
 */
const setTrackingCookie = (res, trackingId) => {
  setCookie(res, 'tracking_id', trackingId, 1000 * 60 * 60 * 24 * 7); // 7 days
};

/**
 * Get all session-related cookies
 * @param {Request} req - Express request object
 * @returns {Object} Object containing all relevant cookies
 */
const getAllSessionCookies = (req) => {
  return {
    sessionId: req.sessionID,
    trackingId: getCookie(req, 'tracking_id'),
    preferences: getCookie(req, 'preferences')
  };
};

module.exports = {
  setCookie,
  getCookie,
  removeCookie,
  hasTrackingCookie,
  setTrackingCookie,
  getAllSessionCookies
};
