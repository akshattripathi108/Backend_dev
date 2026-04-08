const session = require('express-session');
const MongoStore = require('connect-mongo');

// Session configuration
const getSessionConfig = (mongooseConnection) => {
  const config = {
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true, // Prevents JS from accessing the cookie
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: 'strict' // CSRF protection
    }
  };

  // Use MongoDB store if connection is provided
  if (mongooseConnection) {
    try {
      config.store = MongoStore({
        mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/middleware_auth_db',
        collectionName: 'sessions'
      });
    } catch (error) {
      console.log('Note: Using memory store. MongoDB store failed:', error.message);
    }
  }

  return config;
};

// Session middleware (will be initialized after MongoDB connection)
let sessionMiddleware = null;

const initializeSessionMiddleware = (mongooseConnection) => {
  const sessionConfig = getSessionConfig(mongooseConnection);
  sessionMiddleware = session(sessionConfig);
  return sessionMiddleware;
};

// Session utilities
const createSessionData = (user) => ({
  userId: user.id,
  username: user.username,
  createdAt: Date.now(),
  lastActivity: Date.now()
});

const updateSessionActivity = (req) => {
  if (req.session.user) {
    req.session.lastActivity = Date.now();
  }
};

const getSessionInfo = (req) => {
  if (!req.session.user) {
    return null;
  }
  return {
    userId: req.session.user.userId,
    username: req.session.user.username,
    createdAt: req.session.user.createdAt,
    lastActivity: req.session.lastActivity,
    sessionId: req.sessionID
  };
};

const isSessionValid = (req) => {
  return req.session && req.session.user ? true : false;
};

const destroySession = (req, callback) => {
  req.session.destroy(callback);
};

module.exports = {
  initializeSessionMiddleware,
  getSessionConfig,
  getSessionMiddleware: () => sessionMiddleware,
  createSessionData,
  updateSessionActivity,
  getSessionInfo,
  isSessionValid,
  destroySession
};

