const router = require("express").Router();

router.get("/signup", (req, res, next) => { res.render("auth/signup.hbs")})

router.post("/signup", (req, res, next) => {
  console.log(req.body.username);
  
})


module.exports = router;