const isAuthenticated = (req,res,next)  => {
  // console.log(req.session)
  console.log('logged in???')
  console.log(req.session)
  if (req.session.currentUser) {
    return next();
  }
  return res.render('auth/login', {message: "Please log in to view this page."})
}

const isTeacher = ( req, res, next) => {
  console.log("********************* ", req.session.currentUser);
  if(req.session.currentUser && req.session.currentUser.role === 'teacher') return next();

  
  return res.render('auth/login', {message: `You must be logged in as a teacher to view this page.`})
}


module.exports = {
  isAuthenticated,
  isTeacher
};