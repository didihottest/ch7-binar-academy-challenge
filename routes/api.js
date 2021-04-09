const express = require('express');
const app = express();
const routers = express.Router();
const { User_Game, User_Game_Biodata, User_Game_History } = require('./../db/user_game.js')
// to pass form data from body
const multer = require('multer')
// use mongoose ODM 
const mongoose = require('mongoose');
// use request module to pull data from API
const request = require('request');
// use connection module to connect to database from route
require('./../db/connection')
// Get request raw json from postman / api
app.use(express.json());
// Get request form form-urlencoded form postman / api
app.use(express.urlencoded({ extended: true }));