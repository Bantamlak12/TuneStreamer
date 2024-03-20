const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const passport = require('passport');

const routes = require('./routes');
const { dbClient, sessionStore } = require('./utils/db');
const User = require('./models/User');

dotenv.config({ path: './config.env' });

/************************************************/
//  1. Express Setup
/************************************************/
const app = express();
const PORT = process.env.PORT || 3000;

/************************************************/
//   2. Database connection
/************************************************/
dbClient.isAlive();
/************************************************/
//   3. Middleware Configuration
/************************************************/
// MORGAN MIDDLEWARE FOR LOGGING A REQUEST IN A FORMATTED WAY.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// MIDDLEWARE

app.use(express.json());
// SET THE VIEW  ENGINE TO USE EJS
app.set('view engine', 'ejs');
// STATIC FILES LOCATION
app.use(express.static(path.join(__dirname, 'public')));
// SESSION MIDDLEWARE
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      secure: false, // It will be changed to true in production
      httpOnly: true,
    },
  })
);
// LOAD ALL ROUTES  FROM THE /ROUTES/INDEX.JS FILE
app.use(routes);

app.listen(PORT, () => {
  console.log(`Express app is running on port: ${PORT}`);
});

// PASSPORT SETUP
let userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.send(userProfile));
app.get('error', (req, res) => res.send('error logging in'));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// GOOGLE AUTH
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
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
      res.redirect('/dashboard');
    } catch (error) {
      console.error(`Error saving user data: ${error.message}`);
      res.redirect('/signin');
    }
  }
);
