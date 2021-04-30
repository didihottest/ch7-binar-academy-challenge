const User_Game = require('../model/user_game')
const jwt = require('jsonwebtoken')

let loggedIn = []
exports.getGame = async (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, 'secret', (err, decodedToken) => {
      let id = decodedToken.id
      const loginUserCheck = loggedIn.includes(id)
      if (!loginUserCheck){
        loggedIn.push(id)
      }
    })
  } else {
    res.redirect('/login-dashboard')
  }
  const player1 = loggedIn[0]
  const player2 = loggedIn[1]
  
}


exports.postGame = (req, res, next) => {

}