const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// In-memory user database
let users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    age: 28,
    status: "active"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    age: 32,
    status: "active"
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    age: 25,
    status: "inactive"
  }
];

// CREATE - POST /users - Add new user
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email || !age) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (age < 18) {
    return res.status(400).json({ success: false, message: "User must be at least 18 years old" });
  }

  const emailExists = users.some(user => user.email === email);
  if (emailExists) {
    return res.status(400).json({ success: false, message: "Email already exists" });
  }

  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name: name,
    email: email,
    age: age,
    status: "active"
  };

  users.push(newUser);
  res.status(201).json({ success: true, message: "User created successfully", user: newUser });
});

// READ - GET /users - Get all users
app.get('/users', (req, res) => {
  if (users.length === 0) {
    return res.status(404).json({ success: false, message: "No users found" });
  }
  res.status(200).json({ success: true, users: users });
});

// READ - GET /users/:id - Get user by ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({ success: false, message: `User with ID ${req.params.id} not found` });
  }

  res.status(200).json({ success: true, user: user });
});

// READ - GET /users/email/:email - Get user by email
app.get('/users/email/:email', (req, res) => {
  const user = users.find(u => u.email === req.params.email);

  if (!user) {
    return res.status(404).json({ success: false, message: `User with email ${req.params.email} not found` });
  }

  res.status(200).json({ success: true, user: user });
});

// UPDATE - PUT /users/:id - Update user details
app.put('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: `User with ID ${req.params.id} not found` });
  }

  const updates = req.body;

  // Validate email if being updated
  if (updates.email && updates.email !== users[userIndex].email) {
    const emailExists = users.some((u, index) => u.email === updates.email && index !== userIndex);
    if (emailExists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
  }

  // Validate age if being updated
  if (updates.age && updates.age < 18) {
    return res.status(400).json({ success: false, message: "User must be at least 18 years old" });
  }

  // Update allowed fields
  if (updates.name) users[userIndex].name = updates.name;
  if (updates.email) users[userIndex].email = updates.email;
  if (updates.age) users[userIndex].age = updates.age;
  if (updates.status) users[userIndex].status = updates.status;

  res.status(200).json({ success: true, message: "User updated successfully", user: users[userIndex] });
});

// DELETE - DELETE /users/:id - Remove user by ID
app.delete('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: `User with ID ${req.params.id} not found` });
  }

  const deletedUser = users.splice(userIndex, 1);
  res.status(200).json({ success: true, message: "User deleted successfully", user: deletedUser[0] });
});

// DELETE - DELETE /users/inactive/all - Remove all inactive users
app.delete('/users/inactive/all', (req, res) => {
  const initialCount = users.length;
  users = users.filter(u => u.status !== "inactive");
  const deletedCount = initialCount - users.length;

  if (deletedCount === 0) {
    return res.status(404).json({ success: false, message: "No inactive users found" });
  }

  res.status(200).json({ success: true, message: `${deletedCount} inactive user(s) deleted` });
});

// SEARCH - GET /users/search?name=&status=&ageMin=&ageMax= - Search users
app.get('/search/users', (req, res) => {
  const { name, status, ageMin, ageMax } = req.query;

  if (!name && !status && !ageMin && !ageMax) {
    return res.status(400).json({ success: false, message: "Please provide search criteria" });
  }

  let results = users;

  if (name) {
    results = results.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (status) {
    results = results.filter(u => u.status === status);
  }

  if (ageMin) {
    results = results.filter(u => u.age >= parseInt(ageMin));
  }

  if (ageMax) {
    results = results.filter(u => u.age <= parseInt(ageMax));
  }

  if (results.length === 0) {
    return res.status(404).json({ success: false, message: "No users match the search criteria" });
  }

  res.status(200).json({ success: true, results: results });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Total users in database: ${users.length}`);
});
