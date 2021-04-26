const router = require ("express").Router();
const Lesson = require('../models/Lesson.model');
const User = require('../models/User.model');
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

router.get('/:id/delete', isTeacher, (req, res, next) => {
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


router.get('/:id/edit', isTeacher, (req,res,next) => {
  console.log(typeof req.params.id)
  Lesson.findById(req.params.id)
  .then(lessonFromDB => {
    res.render('lessons/edit', { lesson: lessonFromDB });
  })
  .catch(err => {
    next(err);
  });
});

router.get('/:id', (req, res, next) => {
  Lesson.findById(req.params.id)
    .then(lesson => {
      res.render('lessons/show', { lesson });
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id/details', (req, res, next) => {
  const lessonId = req.params.id;
  console.log('show',req.params.id)
  Lesson.findById(lessonId).populate('owner').then(lesson => {
    res.render('/show', { lessonDetails: lesson })
  })
  .catch(err => {
    next(err);
  });
})

router.get('/:id/edit', (req, res, next) => {
  Lesson.findById(req.params.id).populate('student')
  .then(lesson => {
    console.log('lesson-log',lesson);
    User.find().then(users => {
      // console.log(user.role);
      let options = '';
      let selected = '';
      users.forEach(student => {
        selected = lesson.student.map(el => el._id).includes(student._id) ? ' selected' : '';
        options += `<option value="${student._id}" ${selected}>${student.name}</option>`;
      });
      console.log(options);
      res.render('lessons/edit', { lesson, users });
    })
  })
  .catch(err => {
    next(err);
  })
})


module.exports = router;