const router = require("express").Router();
// const { getLessons, addPLessons } = require('../controller/lessons');

/* GET home page */
router.get("/", (req, res, next) => {
  // console.log("Session =====>", req.session);

  res.render("index");
});

// router
//     .route('/')
//     .get(getLessons)
//     .post(addLesson);


module.exports = router;
