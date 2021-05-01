const jwt = require('jsonwebtoken')
// call user_admin model
const User_Admin = require('../model/user_admin')
const {User_Game} = require('../model/user_game')
// middleware for determining flash message
const flashDeterminer = require('./../utility/flashdeterminer')

// JWT token generator
// set token expire time
const maxAge = 3 * 24 * 60 * 60
const createToken = (id, role) => {
  //{id is value}, {'secret is encrypt key'}, { expiresIn is for max age of token }
  return jwt.sign({
    id, role
  }, 'secret', {
    expiresIn: maxAge
  })
}

//login page endpoint 
exports.getLoginDashboard = (req, res, next) => {
  const status = req.query.status;
  if (status != undefined) {
    res.render('login-dashboard', {
      status: status
    })
  } else {
    res.render('login-dashboard', {
      status: null
    })
  }
}
// authenticate login information
exports.postLoginDashboard = async (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  try {
    const user = await User_Admin.login(email, password)
    const token = createToken(user._id, user.role)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.redirect('/dashboard')
  } catch (error) {
    if (error) {
      req.flash('error', error.message)
      res.redirect('/login-dashboard')
    }
  }
}

exports.getSignupDashboard = (req, res, next) => {
  const message = flashDeterminer(req)
  res.render('signup-dashboard', {
    messageSuccess: message[0],
    messageError: message[1]
  })
}

exports.postSignupDashboard = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const role = "admin"
    const userAdmin = await User_Admin.create({ email, password, role })
    req.flash('success',`${userAdmin[email]} Successfully Created, Please Login`)
    res.redirect('/login-dashboard')
  } catch (error) {
    if (error) {
      req.flash('error', error.message)
      res.redirect('/signup-dashboard')
    }
  }


}

// logout user
exports.getLogoutDashboard = (req, res) => {
  res.cookie('jwt', '', {maxAge:1})
  res.redirect('/')
}


// login player 

exports.postLoginGame = async (req, res, next) => {
  const {username, password} = req.body;
  const user = await User_Game.login(username, password)
  const token = createToken(user._id, user.role)
  // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
  // res.redirect('/game')
  res.status(201).json({
    message: token
  })
}