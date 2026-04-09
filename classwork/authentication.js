const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { createSessionData, updateSessionActivity, isSessionValid } = require('./session');
const { setTrackingCookie } = require('./cookies');
const User = require('./models/User');

const initializeDefaultUsers = async () => {
  try {
    const aliceExists = await User.findOne({ username: 'akshat' });
    const bobExists = await User.findOne({ username: 'ajay' });
    if (!aliceExists) {
      const alicePassword = await bcrypt.hash('password123', 10);
      await User.create({ username: 'akshat', password: alicePassword, email: 'akshat@example.com' });
      console.log('✅ Created default user: akshat');
    }
    if (!bobExists) {
      const bobPassword = await bcrypt.hash('securepass', 10);
      await User.create({ username: 'ajay', password: bobPassword, email: 'ajay@example.com' });
      console.log('✅ Created default user: ajay');
    }
  } catch (error) {
    console.error('Error initializing default users:', error);
  }
};

const verifyCredentials = async (username, password) => {
  const normalizedUsername = username.toLowerCase().trim();
  const user = await User.findOne({ username: normalizedUsername });
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;
  return { id: user._id.toString(), username: user.username, email: user.email };
};

const registerHandler = async (req, res, credentials) => {
  const { username, password, email } = credentials;
  if (!username || !password || !email) return { success: false, message: 'Username, email, and password are required' };
  const normalizedUsername = username.toLowerCase().trim();
  const existingUser = await User.findOne({ $or: [{ username: normalizedUsername }, { email: email.toLowerCase().trim() }] });
  if (existingUser) return { success: false, message: 'Username or email already in use' };
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username: normalizedUsername, password: hashedPassword, email: email.toLowerCase().trim() });
  const sessionUser = { id: user._id.toString(), username: user.username, email: user.email };
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
  return { success: true, message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } };
};

const sessionCheckMiddleware = (req, res, next) => {
  updateSessionActivity(req);
  if (!isSessionValid(req)) return res.status(401).json({ error: 'Unauthorized: No active session' });
  req.user = { id: req.session.user.userId, username: req.session.user.username, email: req.session.user.email };
  next();
};

const getProfileHandler = async (req) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return { success: false, message: 'User not found' };
  return { success: true, user };
};

const logoutHandler = (req, callback) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return callback({ success: false, message: 'Logout failed' });
    }
    callback({ success: true, message: 'Logout successful' });
  });
};

const getSessionStatus = (req) => {
  if (isSessionValid(req)) {
    return { isActive: true, user: { id: req.session.user.userId, username: req.session.user.username, email: req.session.user.email }, sessionId: req.sessionID };
  }
  return { isActive: false };
};

module.exports = { registerHandler, loginHandler, sessionCheckMiddleware, getProfileHandler, logoutHandler, getSessionStatus, initializeDefaultUsers };
