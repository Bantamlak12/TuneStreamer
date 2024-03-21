const User = require('../models/User');

class UserController {
  // POST /admin/users/:email
  static async getUser(req, res) {
    try {
      const email = req.params.email;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      const user = await User.find({ email })
        .select('-_id firstName lastName email')
        .lean();

      if (!user || user.length === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.log(`Error getting a user: ${error.message}`);
      return res.status(500).json({ error: 'An error occured while getting a user' });
    }
  }

  //  PUT /admin/users/:email
  static async updateUser(req, res) {
    try {
      const emailId = req.params.email;

      const { firstName, lastName, email } = req.body;

      const updatedUser = await User.findOneAndUpdate(
        { email: emailId },
        { firstName, lastName, email },
        { new: true, runValidators: true } // new to return updated doc
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.log(`Error getting a user: ${error.message}`);
      return res.status(500).json({ error: 'An error occured while updating a user' });
    }
  }

  // DELETE /admin/users/:email
  static async deleteUser(req, res) {
    try {
      const email = req.params.email;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const deletedUser = await User.findOneAndDelete({ email });
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      console.log(`Error deleting a user: ${error.message}`);
      return res.status(500).json({ error: 'An error occured while deleting a user' });
    }
  }

  // DELETE /admin/users
  static async deleteAllUsers(req, res) {
    try {
      await User.deleteMany({});
      res.status(200).json({ message: 'All users deleted successfully' });
    } catch (error) {
      console.log(`Error deleting all users: ${error.message}`);
      return res.status(500).json({ error: 'An error occured while deleting all users' });
    }
  }
}

module.exports = UserController;
