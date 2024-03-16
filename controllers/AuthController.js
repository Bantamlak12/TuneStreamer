const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Admin = require('../models/Admin');

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

      // Create admin
      if (firstName === 'admin' && lastName === 'admin') {
        const existingAdmin = await Admin.findOne({ isAdmin: true });
        if (!existingAdmin) {
          // If no admin add the  new user as an admin
          const newAdmin = new Admin({
            email,
            password: hashedpasswd,
          });
          await newAdmin.save();
          return res.status(200).redirect('/signin');
        }
        return res
          .status(409)
          .json({ error: '"admin" cannot be used as a name' });
      }

      if (firstName === 'admin' || lastName === 'admin') {
        return res
          .status(409)
          .json({ error: '"admin" cannot be used as a name' });
      }

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

      return res.status(200).redirect('/signin');
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: '' });
      }
      console.log(`Error creating user: ${error.message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // SIGN IN A USER
  static async signin(req, res) {
    const { email, password } = req.body;

    // check if it's the admin
    const admin = await Admin.findOne({ email });
    if (admin) {
      const validPassword = await bcrypt.compare(password, admin.password);
      if (validPassword) {
        req.session.isAdminAuthenticated = true;
        return res
          .status(200)
          .json({ isAdmin: true, message: 'Signed in successfully' });
      }
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: true });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: true });
    }

    req.session.isAuthenticated = true;
    return res
      .status(200)
      .json({ isAdmin: false, message: 'Signed in successfully' });
  }

  // SING OUT A USER
  static async signout(req, res) {
    req.session.destroy();
    res.status(200).json({ success: 'Signed out' });
  }

  // OPEN USER PLAYGROUND
  static async getDashboard(req, res) {
    res.render('playground');
  }

  static async getMusicsPage(req, res) {
    res.render('admin-music');
  }

  static async getUsersPage(req, res) {
    res.render('admin-user');
  }
}

module.exports = AuthController;
