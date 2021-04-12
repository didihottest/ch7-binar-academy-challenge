// use express module
const express = require('express');
const app = express();
// use router as a middleware
const routers = require('./routes/router')
// use request module
const request = require("request")
// Cross-Origin Resource Sharing module 
const cors = require('cors');
// use dot env module
const dotenv = require('dotenv');
// use morgan module
const morgan = require('morgan');
// call passport library
const passport = require('passport')
// call method override library
const methodOverride = require('method-override')
// call flash session library
const flash = require('express-flash')
// call express session library
const session = require('express-session')
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
// use flash middleware
app.use(flash())
// create session
app.use(session({
    secret: "7OOLrGhqBgWoO1XBVBXhGO8q",
    resave: false,
    saveUninitialized: false
}))
// initialize passport
app.use(passport.initialize())
// use session on passport
app.use(passport.session())
// use overide middleware
app.use(methodOverride('_method'))
// use router module
app.use(routers)


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