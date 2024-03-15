const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/User');

class AuthController {
  static async getRegister(req, res) {
    res.render('signup');
  }

  static async getLogin(req, res) {
    res.render('signin');
  }

  static async signup(req, res) {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.json({ status: 'error', message: 'Passwords do not match' });
    }
    try {
      // Hash the password
      const saltRound = 10;
      const hashedpasswd = await bcrypt.hash(password, saltRound);

      // Create new user document
      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        password: hashedpasswd,
      });

      // Save the new user to database
      await newUser.save();

      res.status(200).redirect('/signin');
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: '' });
      }
      console.log(error.name);
      console.log(`Error creating user: ${error.message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async signin(req, res) {
    const userData = req.body;
  }

  static async signout(req, res) {
    res.json({ success: 'Signed out' });
  }
}

module.exports = AuthController;
