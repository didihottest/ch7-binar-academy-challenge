// use express module
const express = require('express');
const app = express();
const router = express.Router();
// use request module to pull data from API
const request = require('request');

//home end route 
exports.home = (req, res, next) => {
  res.render('home')
}

//login page endpoint 
exports.login = (req, res, next) => {
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

// dashboard end route
exports.dashboard = (req, res, next) => {
  let status = req.query.status;

  let option = {
    url: "http://localhost:3000/api/users",
    method: "GET",
  }
  request(option, (error, response, body) => {
    if (error) {
      res.send("Error data list is not available")
    } else {
      let currentData = JSON.parse(body);
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