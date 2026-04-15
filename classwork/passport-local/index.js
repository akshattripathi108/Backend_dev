require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('.');

const app = express();

// Session middleware
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Route: Google Login
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route
app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  (req, res) => {
    res.send("Login Successful ✅");
  }
);

// Logout
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.send("Logged out");
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));