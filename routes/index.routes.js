const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  // console.log("Session =====>", req.session);

  res.render("index");
});



module.exports = router;
