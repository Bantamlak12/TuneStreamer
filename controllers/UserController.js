const User = require('../models/User');

class UserController {
  // Delete all users
  static async deleteAllUsers(req, res) {
    try {
      await User.deleteMany({});
      res.status(200).json({ message: 'All users deleted successfully' });
    } catch (error) {
      console.log(`Error deleting all users: ${error.message}`);
      return res
        .status(500)
        .json({ error: 'An error occured while deleting all users' });
    }
  }

  // Get a user
  static async getUser(req, res) {
    try {
      const email = req.body.email;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      const user = await User.find({ email })
        .select('-_id firstName lastName email')
        .lean();

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.log(`Error getting a user: ${error.message}`);
      return res
        .status(500)
        .json({ error: 'An error occured while getting a user' });
    }
  }
}

module.exports = UserController;
