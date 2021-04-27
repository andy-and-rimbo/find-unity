const router = require ("express").Router();
const Lesson = require('../models/Lesson.model');
const User = require('../models/User.model');
const {isAuthenticated, isTeacher} = require("../middleware/auth.middleware");

router.get('/', (req, res, next) => {
Lesson.find()
  .populate('owner')
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
  const { name, description, location, date,time, maxParticipants } = req.body; 
  Lesson.create({
    name,
    description,
    location,
    date,
    time,
    maxParticipants,
    owner: req.session.currentUser._id
  })
    .then((lesson) => {
      User.findByIdAndUpdate(req.session.currentUser._id, { $push: {organisedLessons: lesson._id}}, {new:true})
        .then(newlesson => console.log(newlesson))
      res.redirect('/lessons');
    })
    .catch(err => {
      next(err);
    });
  
});

router.get('/:id/delete', isTeacher, (req, res, next) => {
   
  Lesson.findOneAndDelete(req.params.id) 
    .then(lesson => {
      console.log(lesson);
      console.log(lesson.owner);
      
      User.findByIdAndUpdate(lesson.owner, { $pull: {organisedLessons: req.params.id}})
        .then(user => res.redirect('/'))
        .catch(err => {
          next(err);
        })
      })
})

router.get('/:id/edit', isTeacher, (req,res,next) => {
  // console.log(typeof req.params.id)
  Lesson.findById(req.params.id)
  .then(lessonFromDB => {
    res.render('lessons/edit', { lesson: lessonFromDB });
  })
  .catch(err => {
    next(err);
  });
});

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

router.post('/:lessonId/join/:userId', isAuthenticated, (req,res,next) => {
  console.log('joining')
  console.log(req.params)
  const { userId, lessonId } = req.params;

  Lesson.findById(lessonId)
    .populate('owner')
    .then(lesson => {
      if(lesson.students.includes(userId)) {
        console.log('you are already enrolled');
        return res.render('lessons/show', { lesson: lesson, message: 'You are already enrolled on this course'})
      }
      else {Lesson.findByIdAndUpdate(lessonId, { $push: {students: userId}}, {new: true})
        .then(lesson => console.log(lesson))

        User.findByIdAndUpdate(userId, { $push: {bookedLessons: lessonId}})
          .then(() => res.render('lessons/show', {lesson, isUser: true, isOwner: false, alreadyEnrolled: true}))
          }
    })

  
})

router.post('/:lessonId/leave/:userId', isAuthenticated, (req,res,next) => {
  const { userId, lessonId } = req.params;

  Lesson.findByIdAndUpdate(lessonId,{ $pull: {students: userId}}, {new:true})
    .then(lesson => {
      User.findByIdAndUpdate(userId, { $pull: {bookedLessons: lessonId}})
        .then(() => res.render('lessons/show', {lesson, isUser: true, isOwner: false, alreadyEnrolled: false}))
    })

})

// gets lesson details

router.get('/:id', (req, res, next) => {
  Lesson.findById(req.params.id)
    .populate('owner')
    .then(lesson => {
      console.log('finding lesson');
      console.log(lesson);
      let isUser;
      let isOwner;
      let alreadyEnrolled;

      lesson.spacesLeft = lesson.maxParticipants - lesson.students.length;

      if (req.session.currentUser) {
        isUser = true;
        console.log('booked' , req.session.currentUser.bookedLessons);
        
        if (lesson.owner._id == req.session.currentUser._id) {
          isOwner = true;

        } 
        else if (lesson.students.includes(req.session.currentUser._id)) {
          alreadyEnrolled = true;
        } 
        
      }       
      console.log({isOwner}, {alreadyEnrolled}, {isUser})
      res.render('lessons/show', { lesson, isUser, isOwner, alreadyEnrolled });
    })
    .catch(err => {
      next(err);
    });
});

// router.get('/:id/details', (req, res, next) => {
//   const lessonId = req.params.id;
//   console.log('show',req.params.id)
//   Lesson.findById(lessonId).populate('owner').then(lesson => {
//     res.render('/show', { lessonDetails: lesson })
//   })
//   .catch(err => {
//     next(err);
//   });
// })

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