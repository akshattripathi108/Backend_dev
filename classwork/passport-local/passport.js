const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { verifyCredentials } = require('./auth');

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await verifyCredentials(username, password);
    if (!user) return done(null, false, { message: 'Invalid username or password' });
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) return done(new Error('User not found'));
    done(null, { id: user._id.toString(), username: user.username, email: user.email, role: user.role, designation: user.designation });
  } catch (error) {
    done(error);
  }
});

module.exports = passport;

const initializeDefaultUsers = async () => {
  try {
    const existingUsers = await User.find({});
    if (existingUsers.length === 0) {
      const defaultUsers = [
        { username: 'admin', password: 'admin123', email: 'admin@example.com', role: 'admin', designation: 'System Administrator' },
        { username: 'user', password: 'user123', email: 'user@example.com', role: 'user', designation: 'Regular User' }
      ];
      await User.insertMany(defaultUsers);
    }
  } catch (error) {
    console.error('Error initializing default users:', error);
  }
};

initializeDefaultUsers();   