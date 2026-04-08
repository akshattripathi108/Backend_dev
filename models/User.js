const mongoose = require('mongoose');

/**
 * User Schema for MongoDB
 * Stores user account information
 */

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 50
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: null
    },
    loginCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// Create single indexes (unique constraint creates indexes automatically)
UserSchema.index({ username: 1, email: 1 });

const User = mongoose.model('User', UserSchema);

module.exports = User;
