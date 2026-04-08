const setCookie = (res, name, value, maxAge = 1000 * 60 * 60 * 24, secure = process.env.NODE_ENV === 'production') => {
  res.cookie(name, value, { maxAge, httpOnly: true, secure, sameSite: 'strict', path: '/' });
};

const getCookie = (req, name) => req.cookies ? req.cookies[name] : undefined;

const removeCookie = (res, name) => {
  res.clearCookie(name, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/' });
};

const hasTrackingCookie = (req) => !!getCookie(req, 'tracking_id');

const setTrackingCookie = (res, trackingId) => setCookie(res, 'tracking_id', trackingId, 1000 * 60 * 60 * 24 * 7);

const getAllSessionCookies = (req) => ({
  sessionId: req.sessionID,
  trackingId: getCookie(req, 'tracking_id'),
  preferences: getCookie(req, 'preferences')
});

module.exports = { setCookie, getCookie, removeCookie, hasTrackingCookie, setTrackingCookie, getAllSessionCookies };
