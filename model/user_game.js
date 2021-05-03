// user game / player db
// use mongoose odm library
const mongoose = require('mongoose');
// unique validator library to identify duplicate value
const uniqueValidator = require('mongoose-unique-validator');
// bcrypt for hashing
const bcrypt = require('bcrypt')


// create user_game schema
const User_GameSchema = new mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  username:{
    type: String,
    required: [true, 'username must be filled'],
    unique: true
  },
  password:{
    type: String,
    required: [true, 'password must be filled']
  },
  role:{
    type: String,
    required: [true, 'role must be filled']
  },
  userGameBiodata: { type: mongoose.Schema.Types.ObjectId, ref: 'User_Game_Biodata' },
  userGameHistory: { type: mongoose.Schema.Types.ObjectId, ref: 'User_Game_History' }
});
// use unique validator on username
User_GameSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });

//static function for usergame login 
User_GameSchema.statics.login = async function (username, password){
  const user = await this.findOne({username});
  if (user){
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user;
    }
    throw Error('incorrect password')
  }
  throw Error('incorrect username')
}


// create user_game model using user_gameSchema
const User_Game = mongoose.model('User_Game', User_GameSchema);

// create User_Game_BiodataSchema schema 
const User_Game_BiodataSchema = new mongoose.Schema({
  user_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'User_Game' },
  firstName: {
    type: String,
    required: [true, 'First Name must be filled']
  },
  lastName: String,
  age: Number
})
// create user game biodata model from schema
const User_Game_Biodata = mongoose.model("User_Game_Biodata", User_Game_BiodataSchema)

// create user game history schema
const User_Game_HistorySchema = new mongoose.Schema({
  user_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'User_Game' },
  win: Number,
  lose: Number
})
const User_Game_History = mongoose.model("User_Game_History", User_Game_HistorySchema)


// create user game history model from schema
module.exports = {User_Game, User_Game_Biodata, User_Game_History}
