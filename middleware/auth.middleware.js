const isAuthenticated = (req,res,next)  => {
  // console.log(req.session)

  if (req.session.currentUser) return next();
  return res.render('auth/login', {message: "Please log in to view this page."})
}

checkRole = role => (req,res, next) => {
  if(req.session.currentUser && req.session.currentUser.role === role) return next();
  return res.render('auth/login', {message: `You must be logged in as a ${role} to view this page.`})
}


module.exports = isAuthenticated, checkRole;