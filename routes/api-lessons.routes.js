const router = require ("express").Router();
//const Lesson = require('../models/Lesson.model');
//const User = require('../models/User.model');
//const {isAuthenticated, isTeacher} = require("../middleware/auth.middleware");
const { getLessons } = require('../controller/lessons');
const { getSingleLessons } = require('../controller/lessons');

router
  .route('/')
  .get(getLessons);

module.exports = router;


router
  .route('/:id')
  .get(getSingleLessons);

module.exports = router;
