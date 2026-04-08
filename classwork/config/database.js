const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/middleware_auth_db';

let mongoConnection = null;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    mongoConnection = conn;
    console.log(`\n✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}\n`);
    return conn;
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    console.error('Make sure MongoDB is running on localhost:27017\n');
    process.exit(1);
  }
};

const getConnection = () => mongoConnection;

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('\n✅ MongoDB Disconnected\n');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};

module.exports = { connectDB, disconnectDB, MONGO_URI, getConnection };
