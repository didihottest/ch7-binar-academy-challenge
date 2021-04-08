// use express module
const express = require('express');
const app = express();
// use request module
const request = require("request")
// Cross-Origin Resource Sharing module 
const cors = require('cors');
// import json file that contain login information to server
const logins = require("./json/staticLogin.json")
// router for default route
const router = express.Router()
// use dot env module
const dotenv = require('dotenv');
// use morgan module
const morgan = require('morgan');
// use router as a middleware
const routers = require('./routes/router')
app.use(routers)
// use express static middleware
app.use(express.static(__dirname));
// Get request raw json from postman / api
app.use(express.json());
// use express bodyparser to pass data from body
app.use(express.urlencoded({ extended: true }));
// use cors moudule on express
app.use(cors())
// Load environment configuration
dotenv.config({ path: './config/config.env' })
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// set view engine to ejs
app.set("view engine", "ejs");
// set ejs directory to public folder
app.set('views', './public/views');


// end point if server has an internal error
app.use((error, req, res, next) => {
    res.status(500).render("error", {
        headTitle: "Internal Server Error",
        title: "Internal Server Error",
        subtitle: "Go to Main Page",
        location: "/"
    })
    next()
});

// end point if server has dont have the requested end point
app.use((req, res, next) => {
    res.status(404).render("error", {
        headTitle: "Not Found!",
        title: "404 Not Found",
        subtitle: "Go To Main Page",
        location: "/"
    });
    next()
});

// set server to listen to localhost:3000 
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))