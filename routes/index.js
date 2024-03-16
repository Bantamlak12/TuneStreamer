const express = require('express');
const AuthController = require('../controllers/AuthController');
const {
  useRequireAuth,
  adminRequireAuth,
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/signup', AuthController.getRegister);
router.get('/signin', AuthController.getLogin);
router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);
router.post('/signout', AuthController.signout);
router.get('/dashboard', useRequireAuth, AuthController.getDashboard);
router.get('/admin/musics', adminRequireAuth, AuthController.getMusicsPage);
router.get('/admin/users', adminRequireAuth, AuthController.getUsersPage);

module.exports = router;
