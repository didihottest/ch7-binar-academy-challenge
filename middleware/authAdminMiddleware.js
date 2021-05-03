const jwt = require('jsonwebtoken')
const User_Admin = require('../model/user_admin')

const requireAuth = (req, res, next)=>{





  const token = req.cookies.jwt

  // check json web token exist & verified
  if (token) {
    jwt.verify(token, 'secret', (err, decodedToken) => {
      if(err){
        res.redirect('/login-dashboard')
      } else {
        if(decodedToken.role != 'admin') {
          req.flash('error', "you need to be admin to access this page")
          res.redirect('/login-dashboard')
        }
        console.log(decodedToken)
        next();
      }
    })
  } else {
    res.redirect('/login-dashboard')
  }
}

// check current user
const checkUser = (req, res, next)=>{
  const token = req.cookies.jwt

  if (token){
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if(err){
        res.locals.user = null
        next();
      } else {
        let user = await User_Admin.findById(decodedToken.id)
        res.locals.user = user.email
        next();
      }
    })
  } else {
    res.locals.user = null
    next();
  }
}
//
module.exports= {requireAuth, checkUser}