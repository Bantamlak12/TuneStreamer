const User = require('../models/User');

class UserController {
  static async deleteAllUsers(req, res) {
    try {
      await User.deleteMany({});
      res.status(200).json({ message: 'All users deleted successfully' });
    } catch (error) {
      console.log(`Error deleting a users: ${error.message}`);
      res
        .status(500)
        .json({ error: 'An error occured while deleting a users' });
    }
  }
}

module.exports = UserController;
