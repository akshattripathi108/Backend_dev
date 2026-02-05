// User Management System with CRUD Operations

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

// CREATE - Add new user
function createUser(name, email, age) {
  if (!name || !email || !age) {
    return { success: false, message: "All fields are required" };
  }

  if (age < 18) {
    return { success: false, message: "User must be at least 18 years old" };
  }

  // Check if email already exists
  const emailExists = users.some(user => user.email === email);
  if (emailExists) {
    return { success: false, message: "Email already exists" };
  }

  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name: name,
    email: email,
    age: age,
    status: "active"
  };

  users.push(newUser);
  return { success: true, message: "User created successfully", user: newUser };
}

// READ - Get all users
function getAllUsers() {
  if (users.length === 0) {
    return { success: false, message: "No users found" };
  }
  return { success: true, users: users };
}

// READ - Get user by ID
function getUserById(id) {
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return { success: false, message: `User with ID ${id} not found` };
  }
  
  return { success: true, user: user };
}

// READ - Get user by email
function getUserByEmail(email) {
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return { success: false, message: `User with email ${email} not found` };
  }
  
  return { success: true, user: user };
}

// UPDATE - Update user details
function updateUser(id, updates) {
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return { success: false, message: `User with ID ${id} not found` };
  }

  // Validate email if being updated
  if (updates.email && updates.email !== users[userIndex].email) {
    const emailExists = users.some((u, index) => u.email === updates.email && index !== userIndex);
    if (emailExists) {
      return { success: false, message: "Email already exists" };
    }
  }

  // Validate age if being updated
  if (updates.age && updates.age < 18) {
    return { success: false, message: "User must be at least 18 years old" };
  }

  // Update allowed fields
  if (updates.name) users[userIndex].name = updates.name;
  if (updates.email) users[userIndex].email = updates.email;
  if (updates.age) users[userIndex].age = updates.age;
  if (updates.status) users[userIndex].status = updates.status;

  return { success: true, message: "User updated successfully", user: users[userIndex] };
}

// DELETE - Remove user by ID
function deleteUser(id) {
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return { success: false, message: `User with ID ${id} not found` };
  }

  const deletedUser = users.splice(userIndex, 1);
  return { success: true, message: "User deleted successfully", user: deletedUser[0] };
}

// DELETE - Remove all inactive users
function deleteInactiveUsers() {
  const initialCount = users.length;
  users = users.filter(u => u.status !== "inactive");
  const deletedCount = initialCount - users.length;

  if (deletedCount === 0) {
    return { success: false, message: "No inactive users found" };
  }

  return { success: true, message: `${deletedCount} inactive user(s) deleted` };
}

// SEARCH - Find users by criteria
function searchUsers(criteria) {
  if (!criteria || Object.keys(criteria).length === 0) {
    return { success: false, message: "Please provide search criteria" };
  }

  let results = users;

  if (criteria.name) {
    results = results.filter(u => u.name.toLowerCase().includes(criteria.name.toLowerCase()));
  }

  if (criteria.status) {
    results = results.filter(u => u.status === criteria.status);
  }

  if (criteria.ageMin) {
    results = results.filter(u => u.age >= criteria.ageMin);
  }

  if (criteria.ageMax) {
    results = results.filter(u => u.age <= criteria.ageMax);
  }

  if (results.length === 0) {
    return { success: false, message: "No users match the search criteria" };
  }

  return { success: true, results: results };
}

// DISPLAY - Show all users in formatted way
function displayUsers() {
  if (users.length === 0) {
    console.log("No users in the system");
    return;
  }

  console.log("\n===== ALL USERS =====");
  users.forEach(user => {
    console.log(`\nID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Age: ${user.age}`);
    console.log(`Status: ${user.status}`);
  });
  console.log("\n====================\n");
}

// Example usage (uncomment to test)
/*
console.log(createUser("Alice Brown", "alice@example.com", 26));
console.log(getAllUsers());
console.log(getUserById(1));
console.log(updateUser(1, { age: 30, status: "inactive" }));
console.log(deleteUser(3));
console.log(searchUsers({ status: "active" }));
displayUsers();
*/
