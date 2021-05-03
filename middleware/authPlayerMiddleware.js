const jwt = require('jsonwebtoken')
const { User_Game } = require('../model/user_game')

const requirePlayerAuth = async (req, res, next) => {

  // const token = req.cookies.jwt
  const authHeader = req.get('Authorization');
  // check if there is header
  if (!authHeader) {
    res.status(401).json({
      message: "Not Authorized"
    })
  } else {
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      // verify token and decrpyt it using jwt
      decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
      res.status(401).json({
        message: "Not Authorized"
      })
    }
    if (!decodedToken) {
      res.status(401).json({
        message: "Not Authorized"
      })
    } else {
      let user = await User_Game.findById(decodedToken.id)
      req.userId = user._id
      req.username = user.username
      next();
    }

  }




  // check json web token exist & verified
  // if (token) {
  //   jwt.verify(token, 'secret', (err, decodedToken) => {
  //     if(err){
  //       res.redirect('/login-game')
  //     } else {
  //       if(decodedToken.role != 'player') {
  //         req.flash('error', "you are not player")
  //         res.redirect('/login-game')
  //       }
  //       next();
  //     }
  //   })
  // } else {
  //   res.redirect('/login-game')
  // }
}

// check current user
const checkPlayer = (req, res, next) => {
  // const token = req.cookies.jwt

  // if (token){
  //   jwt.verify(token, 'secret', async (err, decodedToken) => {
  //     if(err){
  //       res.locals.user = null
  //       next();
  //     } else {
  //       console.log(decodedToken)
  //       let user = await User_Game.findById(decodedToken.id)
  //       req.userId = user._id
  //       res.locals.user = user.username
  //       next();
  //     }
  //   })
  // } else {
  //   res.locals.user = null
  next();
  // }
}
//
module.exports = { requirePlayerAuth, checkPlayer }