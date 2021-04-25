const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");

const saltRounds = 10;

router.get("/signup", (req, res, next) => { res.render("auth/signup.hbs")})

router.post("/signup", (req, res, next) => {
  console.log(req.body.username);
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


module.exports = router;