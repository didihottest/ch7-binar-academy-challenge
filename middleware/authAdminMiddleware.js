const jwt = require('jsonwebtoken')
const User_Admin = require('../model/user_admin')

const requireAuth = (req, res, next)=>{

  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'secret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  console.log(decodedToken)
  req.userId = decodedToken.userId;
  next();





  // const token = req.cookies.jwt

  // check json web token exist & verified
  // if (token) {
  //   jwt.verify(token, 'secret', (err, decodedToken) => {
  //     if(err){
  //       res.redirect('/login-dashboard')
  //     } else {
  //       if(decodedToken.role != 'admin') {
  //         req.flash('error', "you need to be admin to access this page")
  //         res.redirect('/login-dashboard')
  //       }
  //       console.log(decodedToken)
  //       next();
  //     }
  //   })
  // } else {
  //   res.redirect('/login-dashboard')
  // }
}

// check current user
const checkUser = (req, res, next)=>{
  // const token = req.cookies.jwt

  // if (token){
  //   jwt.verify(token, 'secret', async (err, decodedToken) => {
  //     if(err){
  //       res.locals.user = null
  //       next();
  //     } else {
  //       let user = await User_Admin.findById(decodedToken.id)
  //       res.locals.user = user.email
  //       next();
  //     }
  //   })
  // } else {
  //   res.locals.user = null
    next();
  // }
}
//
module.exports= {requireAuth, checkUser}