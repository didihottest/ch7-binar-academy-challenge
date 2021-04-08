// use express module
const cors = require('cors');
const express = require('express');
const app = express();
const routers = express.Router();
// use connection module to connect to database from route
require('./../db/connection')
// Get request raw json from postman / api
app.use(express.json());

// Get request form form-urlencoded form postman / api
app.use(express.urlencoded({extended:true}));


module.exports = routers