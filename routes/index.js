const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const MusicController = require('../controllers/MusicController');
const cpUpload = require('../middlewares/musicMiddleware');
const { userRequireAuth, adminRequireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

// ************************************************************ //
// PUBLIC ROUTES TO GET PAGES
// ************************************************************ //
router.get('/signup', AuthController.getSignupPage);
router.get('/signin', AuthController.getSignInPage);

// ************************************************************ //
// AUTHENTICATION ROUTES
// ************************************************************ //
router.post('/auth/signup', AuthController.signup);
router.post('/auth/signin', AuthController.signin);
router.post('/auth/signout', AuthController.signout);

// ************************************************************ //
// USER PLAYGROUND ROUTE
// ************************************************************ //
router.get('/my-musics', userRequireAuth, AuthController.getDashboard);

// ************************************************************ //
// ADMIN ROUTES FOR MANAGING USERS
// ************************************************************ //
router.get('/admin/users', adminRequireAuth, AuthController.getUsersPage);
router.post('/admin/users/:email', adminRequireAuth, UserController.getUser);
router.put('/admin/users/:email', adminRequireAuth, UserController.updateUser);
router.delete('/admin/users/:email', adminRequireAuth, UserController.deleteUser);
router.delete('/admin/users', adminRequireAuth, UserController.deleteAllUsers);

// ************************************************************ //
// ADMIN ROUTES FOR MANAGING MUSICS
// ************************************************************ //
router.get('/admin/musics', adminRequireAuth, AuthController.getMusicsPage);
router.post('/admin/musics', adminRequireAuth, cpUpload, MusicController.addMusic);
router.post('/admin/musics/:id', adminRequireAuth, MusicController.getMusicById);
router.put('/admin/musics/:id', adminRequireAuth, MusicController.updateMusic);
router.delete('/admin/musics/:id', adminRequireAuth, MusicController.deleteMusic);
router.delete('/admin/musics', adminRequireAuth, MusicController.deleteAllMusics);

// ************************************************************ //
// PUBLIC ROUTES FOR MUSICS
// ************************************************************ //
router.get('/musics', MusicController.getAllMusics);
router.post('/musics/search', MusicController.searchMusic);

module.exports = router;
