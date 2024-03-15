const express = require('express');
const AuthController = require('../controllers/AuthController');
const requireAuth = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/signup', AuthController.getRegister);
router.get('/signin', AuthController.getLogin);
router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);
router.post('/signout', AuthController.signout);
router.get('/dashboard', requireAuth, AuthController.getDashboard);
router.get('/admin/musics', AuthController.getMusicsPage);
router.get('/admin/users', AuthController.getUsersPage);

module.exports = router;
