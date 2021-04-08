// use mongoose ODM 
const mongoose = require('mongoose');

const User_Game_BiodataSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First Name must be filled']
  },
  lastName: String,
  age: Number
})

const User_Game_Biodata = mongoose.model("User_Game_Biodata", User_Game_BiodataSchema)

module.exports = {User_Game_BiodataSchema, User_Game_Biodata}