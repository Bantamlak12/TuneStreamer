const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

const routes = require('./routes');
const { dbClient, sessionStore } = require('./utils/db');

dotenv.config({ path: './config.env' });

/************************************************/
//  1. Express Setup
/************************************************/
const app = express();
const PORT = process.env.PORT || 5000;

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
