const bcrypt = require('bcrypt');
const User = require('../models/User');
const Admin = require('../models/Admin');

class AuthController {
  // GET /signup
  static async getSignupPage(req, res) {
    res.render('signup');
  }

  // GET /signin
  static async getSignInPage(req, res) {
    res.render('signin');
  }

  // POST /auth/signup
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
        return res.status(409).json({ error: '"admin" cannot be used as a name' });
      }

      if (firstName === 'admin' || lastName === 'admin') {
        return res.status(409).json({ error: '"admin" cannot be used as a name' });
      }

      // Check if the user is already registered
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'Email already exists' });
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
      console.log(`Error creating user: ${error.message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // POST /auth/signin
  static async signin(req, res) {
    const { email, password } = req.body;

    // check if it's the admin
    const admin = await Admin.findOne({ email });
    if (admin) {
      const validPassword = await bcrypt.compare(password, admin.password);
      if (validPassword) {
        req.session.isAdminAuthenticated = true;
        return res.status(200).json({ isAdmin: true, message: 'Signed in successfully' });
      }
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: true });
    }

    if (!user.password) {
      return res.status(400).json({ error: true });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: true });
    }

    req.session.isUserAuthenticated = true;
    return res.status(200).json({ isAdmin: false, message: 'Signed in successfully' });
  }

  // POST /auth/signout
  static async signout(req, res) {
    req.session.destroy();
    res.status(200).json({ success: 'Signed out' });
  }

  // GET /my-musics
  static async getDashboard(req, res) {
    res.render('playground');
  }

  // GET /admin/musics
  static async getMusicsPage(req, res) {
    res.status(200).render('admin-music');
  }

  // GET /admin/users
  static async getUsersPage(req, res) {
    res.render('admin-user');
  }
}

module.exports = AuthController;
