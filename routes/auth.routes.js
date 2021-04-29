const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const {isAuthenticated, isTeacher} = require("../middleware/auth.middleware");
const { uploader, cloudinary } = require("../config/cloudinary");
// const cloudinary = require('cloudinary').v2;

console.log(uploader);


const saltRounds = 10;

/***** Regular expressions ****
  specialChars = /\W/g
  digits 0-9 = /\d/g
  letters excluding _ = /\w|_/g
 *****************************/

router.get("/signup", (req, res, next) => { res.render("auth/signup")})

router.post("/signup", uploader.single('photo'),(req, res, next) => {

  const { username, password, email, role } = req.body;
  
  if(!username || !password || !email || !role) return res.render("auth/signup", {message: "Please fill in all of the required fields."});

  if (username.match(/\W/g)) return res.render("auth/signup", {message: "Please only use letters and underscores in your username."});
  if(username.length > 30) return res.render("auth/signup", {message: "Username must be shorter than 30 characters."});

  //! uncomment this after development
  // if(!(password.match(/\W/g) && password.match(/\d/g) && password.match(/\w|_/g)) || password.length < 10) 
  //   return res.render("auth/signup", {message: "Please make sure your password includes at least one letter, number and special character. It must also be at least 10 characters long."});
    username.replace(/^\w/, (c) => c.toUpperCase());
    console.log('capitalised username', username);
    

    User.findOne({username:username})
    .then(user => {
      if (user) return res.render("auth/signup", {message: "Username is already taken."});
      User.findOne({email: email})
      .then(user=> {
        if (user) return res.render("auth/signup", {message: "Email is already registered. Please log in."});
    
        const imgPath = req.file.path;
        const publicId = req.file.filename;

        bcryptjs
          .genSalt(saltRounds)
          .then(salt => bcryptjs.hash(password, salt))
          .then(hashedPassword => {
            User.create({
              username,
              email,
              password: hashedPassword,
              role,
              imgPath, 
              publicId
            })
            res.redirect("/")
          })
        })
        .catch(error => next(error))
      })
})

router.get("/login", (req,res) => res.render("auth/login"))

router.post("/login", (req, res, next) => {

    // console.log("Session =====>", req.session);
    

    const { emailOrUsername, password } = req.body;
    // console.log(emailOrUsername, password);

    if (emailOrUsername === '' || password === '') {
      res.render("auth/login", { message: "Please enter both username/email and password." });
      return;
    }

    User.findOne({ $or: [{username: emailOrUsername}, {email: emailOrUsername}]})
    .populate('bookedLessons')
    .populate('organisedLessons')
    .then(user => {
      if (!user) {
        res.render("auth/login", { message: "Couldn't find an account matching these details." });
        return;

      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;

        if (user.role === "student") res.render('users/student-profile', { user });
        else res.render('users/teacher-profile', { user });

      } else {
        res.render('auth/login', {message: "Couldn't find an account matching these details."});
      }
    })
    .catch(error => next(error));
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect("/");
  })
});


router.get('/profile', isAuthenticated, (req, res, next) => {
  res.render('index', {user: req.user})
})

module.exports = router;