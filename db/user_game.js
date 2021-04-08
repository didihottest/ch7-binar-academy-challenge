// use mongoose odm library
const mongoose = require('mongoose');
// import User_Game_Biodata and User_Game_History schema
const {User_Game_BiodataSchema, User_Game_Biodata} = require('./user_game_biodata')
const {User_Game_HistorySchema, User_Game_History} = require('./user_game_history')

// create user_game schema
const User_GameSchema = new mongoose.Schema({
  username:{
    type: String,
    required: [true, 'username must be filled']
  },
  password:{
    type: String,
    required: [true, 'password must be filled']
  },
  userGameBiodata: User_Game_BiodataSchema,
  userGameHistory: User_Game_HistorySchema
});
// create user_game model using user_gameSchema
const User_Game = mongoose.model('User_Game', User_GameSchema);
module.exports = User_Game;