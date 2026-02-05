const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Express Server',
    version: '1.0.0',
    endpoints: {
      home: 'GET /',
      about: 'GET /about',
      users: 'GET /api/users',
      users_by_id: 'GET /api/users/:id',
      create_user: 'POST /api/users',
      health: 'GET /health'
    }
  });
});

// About page - Serve HTML
app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/about.html');
});

// About API endpoint - JSON format
app.get('/api/about', (req, res) => {
  res.json({
    title: 'About This Server',
    description: 'A modern Express.js server with RESTful API endpoints',
    author: 'Development Team',
    email: 'dev@example.com',
    website: 'https://example.com',
    features: [
      'RESTful API design',
      'Request logging',
      'Error handling',
      'Input validation',
      'Health checks',
      'User management endpoints'
    ],
    technologies: [
      'Node.js',
      'Express.js',
      'REST API'
    ],
    version: '1.0.0',
    createdAt: '2026-01-29',
    contact: {
      email: 'support@example.com',
      phone: '+1-800-EXAMPLE',
      address: 'Tech Street, Dev City, DC 12345'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is healthy' });
});

// Get all users (mock data)
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ];
  res.json(users);
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ];
  
  const user = users.find(u => u.id === parseInt(id));
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// Create new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  // Validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email
  };
  
  res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
});

// 404 Not Found middleware
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📝 API Documentation available at http://localhost:${port}/`);
});







































