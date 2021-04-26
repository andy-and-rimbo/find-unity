// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");


// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// session configuration for logging in and out
require("./config/")(app);
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const mongoose = require('./db/index');


// console.log(mongoose.connection);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60, // max age = 1 hour
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    }, 
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    })
  })
)

// configure passport

const User = require('./models/User.model');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => done(null, user._id));
 
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

  // { passReqToCallback: true },
    // function(username, password, done) {
    //   User.findOne({username: username }, function(err, user) {
    //     if (err) { return done(err);}
    //     if (!user) {
    //       return done(null, false, {message: 'Incorrect username.'});
    //     }
    //     if ((!bcrypt.compareSync(password, user.password))) {
    //       return done(null, false, { message: 'Incorrect password.' });

    //     }
      //   return done(null,user);
      // }
    //   )
    // }
passport.use(
  new LocalStrategy((username, password, done) => {
      // this logic will be executed when we log in

      User.findOne({ username: username })
        .then(userFromDB => {
          console.log('loggin in')
          if (userFromDB === null) {
            // there is no user with this username
            done(null, false, { message: 'Wrong Credentials' });
          } else if (!bcrypt.compareSync(password, userFromDB.password)) {
            console.log('wrong Password')

            // the password does not match
            done(null, false, { message: 'Wrong Credentials' });
          } else {
            // everything correct - user should be logged in
            done(null, userFromDB);
          }
        })
        .catch(err => {
          next(err);
        })
    }))
  // (username, password, done) => {
  //     console.log('login')
  //     User.findOne({ username })
  //       .then(user => {
  //         console.log(user)
  //         console.log(username, password)

  //         if (!user) {
  //           return done(null, false, { message: 'Incorrect username' });
  //         }
 
  //         if (!bcrypt.compareSync(password, user.password)) {
  //           return done(null, false, { message: 'Incorrect password' });
  //         }
 
  //         done(null, user);
  //       })
  //       .catch(err => done(err));
  //   }

    // { passReqToCallback: true },
    // {
    //   usernameField: 'username', // by default
    //   // passwordField: 'password' // by default
    // },
    


app.use(passport.initialize());
app.use(passport.session());


// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// default value for title local
const projectName = "find-unity";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with Ironlauncher`;

// 👇 Start handling routes here
const index = require("./routes/index.routes");
const auth = require("./routes/auth.routes");

app.use("/", index);
app.use("/", auth)


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
