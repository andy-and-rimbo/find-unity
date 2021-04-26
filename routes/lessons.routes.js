const router = require ("express").Router();
const Lesson = require('../models/Lesson.model');
const {isAuthenticated, isTeacher} = require("../middleware/auth.middleware");

router.get('/', (req, res, next) => {
Lesson.find()
  .then(lessons => {
    res.render('lessons/index', { lessonList: lessons });
  })
  .catch(err => {
    next(err);
  })
});

router.get('/add', isTeacher, (req, res, next) => {
  res.render('lessons/add');
});

router.post('/', (req, res, next) => {
  const { name, description, location, date,time } = req.body; 
  Lesson.create({
    name,
    description,
    location,
    date,
    time
    // owner: req.user._id
  })
    .then(() => {
      res.redirect('/lessons');
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id/delete', (req, res, next) => {
  Lesson.findOneAndDelete(req.params.id) 
    .then(() => {
      res.redirect('/lessons');
    })
    .catch(err => {
      next(err);
    });
})

router.post('/:id', (req,res, next) => {
  const { name, description, location, date,time } = req.body; 
  Lesson.findByIdAndUpdate(req.params.id, {
    name,
    description,
    location,
    date,
    time
  })
  .then (() => {
    res.redirect('/lessons');
})
  .catch(err => {
    next(err);
  })
});

router.get('/:id/edit', (req,res,next) => {
  console.log(typeof req.params.id)
  Lesson.findById(req.params.id)
  .then(lessonFromDB => {
    console.log('DB',lessonFromDB)
    res.render('lessons/edit', { lesson: lessonFromDB });
  })
  .catch(err => {
    next(err);
    console.log('Error',err)
  });
})


module.exports = router;