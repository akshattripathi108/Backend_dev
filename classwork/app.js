const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { decryptRequestMiddleware, encryptResponseMiddleware } = require('./middleware');
const { generateSecretKey } = require('./encrypt');
const { initializeSessionMiddleware, getSessionMiddleware } = require('./session');
const { loginHandler, sessionCheckMiddleware, getProfileHandler, logoutHandler, getSessionStatus, initializeDefaultUsers } = require('./auth');
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || generateSecretKey();

// Core middleware setup (before session and routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes available
const ROUTES = [
  { method: 'POST', path: '/login', description: 'Login with username and password' },
  { method: 'GET', path: '/session-check', description: 'Check if user has active session' },
  { method: 'GET', path: '/profile', description: 'Get authenticated user profile' },
  { method: 'POST', path: '/logout', description: 'Logout and destroy session' },
  { method: 'GET', path: '/session-status', description: 'Get detailed session status' },
  { method: 'GET', path: '/data', description: 'Get encrypted data' },
  { method: 'POST', path: '/decrypt', description: 'Decrypt request payload' },
  { method: 'GET', path: '/encrypt', description: 'Get encrypted response' },
  { method: 'GET', path: '/routes', description: 'Get all available routes' }
];

// Function to setup routes - will be called after session middleware is added
const setupRoutes = () => {
  // ===== Authentication Routes =====

  /**
   * POST /login
   * Login with username and password
   */
  app.post('/login', async (req, res) => {
    try {
      const result = await loginHandler(req, res, req.body);
      
      if (!result.success) {
        return res.status(401).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Login failed due to server error' });
    }
  });

  /**
   * GET /session-check
   */
  app.get('/session-check', sessionCheckMiddleware, (req, res) => {
    res.json({
      isActive: true,
      message: 'User has active session',
      user: req.user
    });
  });

  /**
   * GET /profile
   */
  app.get('/profile', sessionCheckMiddleware, async (req, res) => {
    try {
      const profile = await getProfileHandler(req);
      
      if (!profile) {
        return res.status(404).json({ error: 'User profile not found' });
      }

      res.json({
        message: 'User profile retrieved successfully',
        profile
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ error: 'Failed to retrieve profile' });
    }
  });

  /**
   * POST /logout
   */
  app.post('/logout', sessionCheckMiddleware, (req, res) => {
    logoutHandler(req, (result) => {
      res.json(result);
    });
  });

  /**
   * GET /session-status
   */
  app.get('/session-status', (req, res) => {
    const status = getSessionStatus(req);
    res.json(status);
  });

  // ===== Encryption Routes (Optional) =====

  app.get('/data', encryptResponseMiddleware(SECRET_KEY), (req, res) => {
    res.json({ 
      id: 1, 
      name: 'Sample Data', 
      timestamp: Date.now(), 
      content: 'This is encrypted sample data.' 
    });
  });

  app.post('/decrypt', decryptRequestMiddleware(SECRET_KEY), (req, res) => {
    res.json({ 
      message: 'Decryption successful',
      decryptedBody: req.body, 
      decryptedPayload: req.decryptedPayload 
    });
  });

  app.get('/encrypt', encryptResponseMiddleware(SECRET_KEY), (req, res) => {
    res.json({ message: 'This response will be encrypted when requested.' });
  });

  app.get('/encrypt-always', encryptResponseMiddleware(SECRET_KEY, { autoEncrypt: true }), (req, res) => {
    res.json({ message: 'Auto-encrypted response.' });
  });

  // ===== Information Routes =====

  app.get('/', (req, res) => {
    res.json({
      message: 'Session & Cookie Authentication Example',
      version: '1.0.0',
      status: 'running',
      authentication: 'Session-based with cookies + MongoDB',
      note: 'Login first with POST /login, then use other protected routes',
      testAccounts: [
        { username: 'alice', password: 'password123' },
        { username: 'bob', password: 'securepass' }
      ],
      routes: ROUTES
    });
  });

  app.get('/routes', (req, res) => {
    res.json({ 
      message: 'Available routes',
      routes: ROUTES 
    });
  });

  app.get('/secret', (req, res) => {
    res.json({ secretKey: SECRET_KEY });
  });

  // ===== Error Handling =====

  // 404 - Not Found
  app.use((req, res) => {
    res.status(404).json({ 
      error: 'Not Found', 
      path: req.path,
      method: req.method
    });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 400).json({ 
      error: err.message || 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  });
};

// ===== Start Server =====

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    const mongoConn = await connectDB();
    
    // 2. Initialize and add session middleware BEFORE routes
    initializeSessionMiddleware(mongoConn);
    app.use(getSessionMiddleware());
    
    // 3. Setup all routes AFTER session middleware
    setupRoutes();
    
    // 4. Initialize default users
    await initializeDefaultUsers();

    // 5. Start listening
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n================================`);
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ Network: http://10.167.245.238:${PORT}`);
      console.log(`================================`);
      console.log(`\nAuthentication Type: Session-based with HTTP-only Cookies + MongoDB`);
      console.log(`Session TTL: 24 hours`);
      console.log(`Database: MongoDB (Compass ready)\n`);
      console.log(`Test Accounts:`);
      console.log(`  - username: alice, password: password123`);
      console.log(`  - username: bob, password: securepass\n`);
      console.log(`Quick Start:`);
      console.log(`  1. POST http://localhost:3000/login`);
      console.log(`     Body: { "username": "alice", "password": "password123" }`);
      console.log(`  2. GET http://localhost:3000/profile (auto-uses session cookie)`);
      console.log(`  3. GET http://localhost:3000/session-status`);
      console.log(`  4. POST http://localhost:3000/logout\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
