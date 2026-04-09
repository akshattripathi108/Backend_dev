const { createSessionData, updateSessionActivity, isSessionValid } = require('./session');
const { setTrackingCookie } = require('./cookies');
const User = require('./models/User');

const initializeDefaultUsers = async () => {
  try {
    const aliceExists = await User.findOne({ username: 'alice' });
    const bobExists = await User.findOne({ username: 'bob' });
    if (!aliceExists) {
      await User.create({ username: 'alice', password: 'password123', email: 'alice@example.com', role: 'admin', designation: 'Administrator' });
      console.log('✅ Created default user: alice');
    }
    if (!bobExists) {
      await User.create({ username: 'bob', password: 'securepass', email: 'bob@example.com', role: 'user', designation: 'Developer' });
      console.log('✅ Created default user: bob');
    }
  } catch (error) {
    console.error('Error initializing default users:', error.message);
  }
};

const verifyCredentials = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user || user.password !== password) return null;
  return { id: user._id.toString(), username: user.username, email: user.email, role: user.role, designation: user.designation };
};

const registerHandler = async (req, res, credentials) => {
  const { username, password, email, role, designation } = credentials;
  if (!username || !password || !email || !role || !designation) return { success: false, message: 'Username, email, password, role, and designation are required' };
  const normalizedUsername = username.toLowerCase().trim();
  const existingUser = await User.findOne({ $or: [{ username: normalizedUsername }, { email: email.toLowerCase().trim() }] });
  if (existingUser) return { success: false, message: 'Username or email already in use' };
  const user = await User.create({ username: normalizedUsername, password, email: email.toLowerCase().trim(), role, designation });
  const sessionUser = { id: user._id.toString(), username: user.username, email: user.email, role: user.role, designation: user.designation };
  req.session.user = createSessionData(sessionUser);
  req.session.lastActivity = Date.now();
  setTrackingCookie(res, `tracking_${user._id.toString()}_${Date.now()}`);
  return { success: true, message: 'Registration successful', user: sessionUser };
};

const loginHandler = async (req, res, credentials) => {
  const { username, password } = credentials;
  if (!username || !password) return { success: false, message: 'Username and password are required' };
  const user = await verifyCredentials(username, password);
  if (!user) return { success: false, message: 'Invalid username or password' };
  req.session.user = createSessionData(user);
  req.session.lastActivity = Date.now();
  try {
    await User.findByIdAndUpdate(user.id, { lastLogin: new Date(), $inc: { loginCount: 1 } });
  } catch (error) {
    console.error('Error updating login info:', error);
  }
  setTrackingCookie(res, `tracking_${user.id}_${Date.now()}`);
  return { success: true, message: 'Login successful', user: { id: user.id, username: user.username, email: user.email, role: user.role, designation: user.designation } };
};

const sessionCheckMiddleware = (req, res, next) => {
  updateSessionActivity(req);
  if (!isSessionValid(req)) return res.status(401).json({ error: 'Unauthorized: No active session' });
  req.user = { id: req.session.user.userId, username: req.session.user.username };
  next();
};

const getProfileHandler = async (req) => {
  if (!isSessionValid(req)) return null;
  try {
    const user = await User.findById(req.session.user.userId);
    return user ? {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      designation: user.designation,
      lastLogin: user.lastLogin,
      loginCount: user.loginCount,
      sessionCreated: new Date(req.session.user.createdAt).toISOString(),
      lastActivity: new Date(req.session.lastActivity).toISOString()
    } : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

const logoutHandler = (req, callback) => {
  req.session.destroy((err) => {
    if (err) callback({ success: false, message: 'Logout failed' });
    else callback({ success: true, message: 'Logout successful' });
  });
};

const getSessionStatus = (req) => {
  if (!isSessionValid(req)) return { isActive: false };
  return {
    isActive: true,
    sessionId: req.sessionID,
    userId: req.session.user.userId,
    username: req.session.user.username,
    createdAt: new Date(req.session.user.createdAt).toISOString(),
    lastActivity: new Date(req.session.lastActivity).toISOString(),
    cookie: { maxAge: req.session.cookie.maxAge, expires: req.session.cookie.expires ? new Date(req.session.cookie.expires).toISOString() : null }
  };
};

module.exports = { verifyCredentials, registerHandler, loginHandler, sessionCheckMiddleware, getProfileHandler, logoutHandler, getSessionStatus, initializeDefaultUsers };
