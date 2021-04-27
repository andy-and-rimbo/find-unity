const router = require("express").Router();
const {isAuthenticated, isTeacher} = require("../middleware/auth.middleware");

/* GET home page */
router.get("/", (req, res, next) => {
  // console.log("Session =====>", req.session);

  res.render("index");
});

router.get('/profile/:id', isAuthenticated, (req, res, next) => {
  console.log(req.session.currentUser)
  if(req.session.currentUser.role === 'teacher') return res.render('users/teacher-profile')
  res.render('users/student-profile')
})


module.exports = router;
