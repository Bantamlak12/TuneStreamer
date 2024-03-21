const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const dotenv = require('dotenv');

const router = express.Router();

dotenv.config({ path: './config.env' });

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// PASSPORT SETUP
let userProfile;

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// GOOGLE AUTH
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALL_BACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  async function (req, res) {
    try {
      // Extract user data from the profile
      const { id, name, emails } = userProfile;

      // Check if the user exists in the database
      const user = await User.findOne({ googleId: id });
      if (!user) {
        const newUser = new User({
          googleId: id,
          firstName: name.givenName,
          lastName: name.familyName,
          email: emails[0].value,
        });

        await newUser.save();
      }

      req.session.isUserAuthenticated = true;
      res.redirect('/my-musics');
    } catch (error) {
      console.error(`Error saving user data: ${error.message}`);
      res.redirect('/signin');
    }
  }
);

// router.get('/success', (req, res) => res.send(userProfile));
// router.get('/error', (req, res) => res.send('error logging in'));

module.exports = router;
