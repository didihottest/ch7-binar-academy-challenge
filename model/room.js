// use mongoose odm library
const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  creator:{
    type: String,
    required: [true, 'user not found'],
    unique: true
  },
  name:{
    type: String,
    required: [true, 'Room Name must be filled']
  }
}, 
{
  timestamps: true
});

const Room = mongoose.model('Room', RoomSchema)

module.exports = Room