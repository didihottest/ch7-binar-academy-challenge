// check if user has logged in or not
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}
// if user has logged in autoredirect to dashboard when user tried to access /login and / endpoint
const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard')
  } else {
    next()
  }
}

module.exports = {checkAuthenticated, checkNotAuthenticated}