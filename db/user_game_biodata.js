// use mongoose ODM 
const mongoose = require('mongoose');

const User_Game_BiodataSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First Name must be filled']
  },
  lastName: String,
  birthDate: Date
})