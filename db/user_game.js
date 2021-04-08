// use mongoose odm library
const mongoose = require('mongoose');

// create user_game schema
const User_GameSchema = new mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  username:{
    type: String,
    required: [true, 'username must be filled']
  },
  password:{
    type: String,
    required: [true, 'password must be filled']
  },
  userGameBiodata: { type: mongoose.Schema.Types.ObjectId, ref: 'User_Game_Biodata' },
  userGameHistory: { type: mongoose.Schema.Types.ObjectId, ref: 'User_Game_History' }
});
// create user_game model using user_gameSchema
const User_Game = mongoose.model('User_Game', User_GameSchema);

const User_Game_BiodataSchema = new mongoose.Schema({
  user_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'User_Game' },
  firstName: {
    type: String,
    required: [true, 'First Name must be filled']
  },
  lastName: String,
  age: Number
})
const User_Game_Biodata = mongoose.model("User_Game_Biodata", User_Game_BiodataSchema)

const User_Game_HistorySchema = new mongoose.Schema({
  user_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'User_Game' },
  win: Number,
  lose: Number
})
const User_Game_History = mongoose.model("User_Game_History", User_Game_HistorySchema)

module.exports = {User_Game, User_Game_Biodata, User_Game_History}

// module.exports = User_Game;
// module.exports = {User_Game, User_Game_Biodata, User_Game_History}
// module.exports = {User_Game_HistorySchema}