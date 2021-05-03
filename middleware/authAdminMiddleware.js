const jwt = require('jsonwebtoken')
const User_Admin = require('../model/user_admin')

// check authentification from cookies
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt

  // check json web token exist & verified
  if (token) {
    jwt.verify(token, 'secret', (err, decodedToken) => {
      if (err) {
        // redirect to login if error
        res.redirect('/login-dashboard')
      } else {
        // redirect to login if error and give error message using flash

        if (decodedToken.role != 'admin') {
          req.flash('error', "you need to be admin to access this page")
          res.redirect('/login-dashboard')
        }
        // next to another middleware if success
        next();
      }
    })
  } else {
    // redirect to login if error

    res.redirect('/login-dashboard')
  }
}

// check who is the current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    // verify token
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if (err) {
        // set user to null if token error
        res.locals.user = null
        next();
      } else {
        // find user from database and assign it res.locals.user
        let user = await User_Admin.findById(decodedToken.id)
        res.locals.user = user.email
        // next to another middleware
        next();
      }
    })
  } else {
    // set to null if error
    res.locals.user = null
    // next to another middleware
    next();
  }
}
// export modules
module.exports = { requireAuth, checkUser }