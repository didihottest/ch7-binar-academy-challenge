// use express module
const express = require('express');
const app = express();
const routers = express.Router();
// use connection module to connect to database from route
require('./connection')


// index route
app.get("/", function (req, res) {
  res.render("index");
});
// login route
app.get("/login", function (req, res) {
  res.render("login");
})



module.exports = routers