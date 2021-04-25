const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");

const saltRounds = 10;

router.get("/signup", (req, res, next) => { res.render("auth/signup")})

router.post("/signup", (req, res, next) => {

  const { username, password, email, role } = req.body;
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        email,
        password: hashedPassword,
        role,
      })
    })
    .catch(error => next(error))
    res.redirect("/")
})

router.get("/login", (req,res) => res.render("auth/login"))

router.post("/login", (req, res, next) => {

    const { emailOrUsername, password } = req.body;
    console.log(emailOrUsername, password);

    if (emailOrUsername === '' || password === '') {
      res.render("auth/login", { message: "Please enter both username/email and password." });
      return;
    }

    User.findOne({ $or: [{username: emailOrUsername}, {email: emailOrUsername}]})
    .then(user => {
      if (!user) {
        res.render("auth/login", { message: "Couldn't find an account matching these details." });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        if (user.role === "student") res.render('users/student-profile', { user });
        res.render('users/teacher-profile', { user });
      } else {
        res.render('auth/login', {message: "Couldn't find an account matching these details."});
      }
    })
    .catch(error => next(error));
})

module.exports = router;