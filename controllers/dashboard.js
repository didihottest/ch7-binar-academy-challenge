const loginData = require("../json/staticLogin.json")
const passport = require('passport')
const initializePassport = require('../passport-config')
initializePassport(
  passport,
  email => loginData.find(user => user.email === email),
  id => loginData.find(user => user.id === id)
)

// use request module to pull data from API
const request = require('request');

//home end route 
exports.home = (req, res, next) => {
  res.render('home')
}

//login page endpoint 
exports.login =  (req, res, next) => {
  const status = req.query.status;
  if (status != undefined) {
    res.render('login', {
      status: status
    })
  } else {
    res.render('login', {
      status: null
    })
  }

}
// authenticate login information
exports.loginPost = passport.authenticate('local', {
  successRedirect: '/dashboard', // if true redirect to dashboard
  failureRedirect: '/login', // if false redirect to login
  failureFlash: true
})

// dashboard end route
exports.dashboard = (req, res, next) => {
  let status = req.query.status;

  let option = {
    url: "http://localhost:3000/api/users",
    method: "GET",
  }
  // get data from api
  request(option, (error, response, body) => {
    if (error) {
      res.send("Error data list is not available")
    } else {
      let currentData = JSON.parse(body);
      //send data to crud ejs
      res.render("crud", {
        data: currentData,
        status: status
      });
    }
  })
}

// edit page end route
exports.edit = (req, res, next) => {
  let id = req.query.id;
  // get data from api
  let option = {
    url: "http://localhost:3000/api/user",
    method: "GET",
    qs: {
      id: id
    }
  }
  request(option, (error, response, body) => {
    if (error) {
      res.send("Error data list is not available")
    } else {
      let currentData = JSON.parse(body);
      if (currentData.status == "failed") {
        res.render("error", {
          headTitle: "Not Found!",
          title: currentData.message,
          subtitle: "Go To Main Page",
          location: "/"
        });
      } else {
        // send data to /edit 
        res.render("edit", {
          data: currentData
        });
      }

    }
  })
}

// add user_game endpoint 
exports.add = (req, res, next) => {
  const status = req.query.status
  // condition if there is no status query
  if (status != undefined) {
    res.render("add", {
      status: status
    })
    console.log("firstif")
  } else {
    res.render("add", {
      status: null
    })
  }

}
// logout user
exports.logout = (req, res) => {
  req.logOut()
  res.redirect('/login')
}
