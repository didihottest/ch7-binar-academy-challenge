// use mongoose ODM 
const mongoose = require('mongoose');

const User_Game_HistorySchema = new mongoose.Schema({
  win: Number,
  lose: Number
})

const User_Game_History = mongoose.model("User_Game_History", User_Game_HistorySchema)

module.exports = {User_Game_HistorySchema, User_Game_History}