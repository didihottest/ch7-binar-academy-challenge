const jwt = require('jsonwebtoken')
// call user_admin model
const User_Admin = require('../model/user_admin')
const { User_Game } = require('../model/user_game')
// middleware for determining flash message
const flashDeterminer = require('./../utility/flashdeterminer')
// axios module 
const axios = require('axios')
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
  try {
    const message = flashDeterminer(req)
    res.render('login-dashboard', {
      messageSuccess: message[0],
      messageError: message[1]
    })
  } catch (error) {
    req.flash('error', error.message)
    res.redirect('/')
  }
}
// authenticate login information
exports.postLoginDashboard = async (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  try {
    // use login static function from user_admin schema
    const user = await User_Admin.login(email, password)
    // create token
    const token = createToken(user._id, user.role)
    // send cookie with token
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.redirect('/dashboard')
  } catch (error) {
    if (error) {
      // error handling
      req.flash('error', error.message)
      res.redirect('/login-dashboard')
    }
  }
}

exports.getSignupDashboard = (req, res, next) => {
  // error message handling using flash module
  try {
    const message = flashDeterminer(req)
    res.render('signup-dashboard', {
      messageSuccess: message[0],
      messageError: message[1]
    })
  } catch (error) {
    req.flash('error', error.message)
    res.redirect('/')
  }
}

// signup post controller 
exports.postSignupDashboard = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const role = "admin"
    // insert data to database
    const userAdmin = await User_Admin.create({ email, password, role })
    req.flash('success', `${userAdmin.email} Account Successfully Created, Please Login`)
    res.redirect('/login-dashboard')
  } catch (error) {
    // error handling
    if (error) {
      req.flash('error', error.message)
      res.redirect('/signup-dashboard')
    }
  }
}

// logout user
exports.getLogoutDashboard = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
  } catch (error) {
    req.flash('error', error.message)
    res.redirect('/')
  }
}


// login player 
exports.postLoginGame = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User_Game.login(username, password)
    const token = createToken(user._id, user.role)
    res.status(201).json({
      message: token
    })
  } catch (error) {
    req.flash('error', error.message)
    res.redirect('/login-game')
  }

}

// register player 
exports.getRegisterPlayer = (req, res, next) => {
  res.status(200).json({
    title: "register your new account",
    message: "post your username, password, firstName, lastName, age in postman with the same exact value"
  })
}
// register player endpoint
exports.postRegisterPlayer = (req, res, next) => {
  const { username, password, firstName, lastName, age } = req.body;
  const win = req.body.win || "0"
  const lose = req.body.lose || "0"
  const role = "player";
  // post data to api
  axios.post("http://localhost:3000/api/user", {
    username, password, firstName, lastName, age, win, lose, role
  }).then(response => {
    // send json if successfull
    res.status(201).json({
      status: "success",
      message: response.data
    })
  }).catch(error => {
    // if error use this function to send error message
    res.status(400).json({
      status: "failed to add new user",
      message: "make sure to fill all the username, password, firstName, lastName, and age data or there is a duplicate username"
    })
  })
}