// use mongoose odm library
const mongoose = require('mongoose');
// create user_game schema
const user_gameSchema = new mongoose.Schema({
  username:{
    type: String,
    required: [true, 'username must be filled']
  },
  password:{
    type: String,
    required: [true, 'password must be filled']
  }
});
// create user_game model using user_gameSchema
const user_game = mongoose.model('user_game', user_gameSchema);
module.exports = user_game;