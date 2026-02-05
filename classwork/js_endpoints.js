const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Sample data
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
];

// GET - Retrieve all users
app.get('/users', (req, res) => {
  res.json(users);
});

// GET - Root endpoint
app.get('/', (req, res) => {
  res.send('API is running');
});

// POST - Create new user
app.post('/users', (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT - Replace user
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updatedUser = req.body;
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex !== -1) {
    users[userIndex] = updatedUser;
    res.json(updatedUser);
  } else {
    res.status(404).send('User not found');
  }
});

// PATCH - Partially update user
app.patch('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userUpdates = req.body;
  const user = users.find((u) => u.id === userId);

  if (user) {
    Object.assign(user, userUpdates);
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

// DELETE - Delete specific user
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send('User not found');
  }
});

// DELETE - Delete all users
app.delete('/users', (req, res) => {
  users.length = 0;
  res.status(204).send();
});

// OPTIONS - Describe communication options
app.options('/users', (req, res) => {
  res.set('Allow', 'GET,POST,PUT,DELETE,PATCH,OPTIONS').send();
});

// HEAD - Retrieve headers only
app.head('/users', (req, res) => {
  res.set('Content-Type', 'application/json').send();
});

// CONNECT - Not implemented
app.use('/proxy', (req, res) => {
  res.status(501).send('CONNECT method not implemented');
});

// TRACE - Not implemented
app.use('/trace', (req, res) => {
  res.status(501).send('TRACE method not implemented');
});

// Server initialization
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

