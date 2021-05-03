//// middleware for player authentication


// import jwt module
const jwt = require('jsonwebtoken')
// import user game module from user_game model
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
    // if false send not authorized message
    if (!decodedToken) {
      res.status(401).json({
        message: "Not Authorized"
      })
    } else {
      // find user from database and assign it to req value
      let user = await User_Game.findById(decodedToken.id)
      req.userId = user._id
      req.username = user.username
      // next middleware
      next();
    }

  }
}
// export module
module.exports = { requirePlayerAuth }