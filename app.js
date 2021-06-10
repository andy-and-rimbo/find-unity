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

hbs.handlebars.registerHelper('capitalize', (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
)

const app = express();

// session configuration for logging in and out
require("./config/")(app);
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('./db/index');

// console.log(mongoose.connection);
const isAuthenticated = require("./middleware/auth.middleware");

// app.use(isAuthenticated)
console.log('!!!!!!!!!!!!!!!!!!!!!', mongoose.connection)

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60, // max age = 1 hour
      // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      secure: false,
      httpOnly: true,
    }, 
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    })
    // store: MongoStore.create({
    //   mongoUrl: "mongodb+srv://RimboAndy:vvVLCJ3b6Sd2CFu@cluster0.33j5g.mongodb.net/find-unity?retryWrites=true&w=majority",
    // })

  })
)

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
const lessons = require("./routes/lessons.routes");
const apiLessons = require("./routes/api-lessons.routes");

app.use(function (req, res, next) {
  res.locals.session = req.session;
  
  next();
});

app.use("/", index);
app.use("/", auth);
app.use("/lessons", lessons);
app.use("/api/v1/lessons", apiLessons);




// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
