const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'A user should have a first name'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'A user should have a last name'],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'A user should have an email'],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email',
    ],
  },
  password: {
    type: String,
    trim: true,
    minlength: [8, 'Password should be at least 8 characters'],
  },
  googleId: {
    type: String,
  },
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
