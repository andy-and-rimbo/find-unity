const router = require("express").Router();
const {isAuthenticated, isTeacher} = require("../middleware/auth.middleware");
const User = require("../models/User.model");

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



router.get('/myprofile', isAuthenticated, (req,res,next) => {
  // console.log(req.session.currentUser);
  
  User.findById(req.session.currentUser._id)
    .populate('bookedLessons')
    .populate('organisedLessons')
    .then (user => {
      console.log(user);
      
      if(user.role === 'teacher') return res.render('users/teacher-profile', {user})
      res.render('users/student-profile', {user})
    })
})

module.exports = router;
