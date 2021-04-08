// use mongoose ODM 
const mongoose = require('mongoose');

const User_Game_BiodataSchema = new mongoose.Schema({
  win: Number,
  lose: Number
})