const jwt = require('jsonwebtoken')
const User_Game = require('../model/user_game')

const requireAuth = (req, res, next)=>{

  const token = req.cookies.jwt
  // check json web token exist & verified
  if (token) {
    jwt.verify(token, 'secret', (err, decodedToken) => {
      if(err){
        res.redirect('/login-game')
      } else {
        if(decodedToken.role != 'player') {
          req.flash('error', "you are not player")
          res.redirect('/login-game')
        }
        next();
      }
    })
  } else {
    res.redirect('/login-game')
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
        let user = await User_Game.findById(decodedToken.id)
        res.locals.user = user.username
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