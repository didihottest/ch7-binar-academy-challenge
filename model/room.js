// room DB schema
// use mongoose odm library
const mongoose = require('mongoose');
// create room schema
const RoomSchema = new mongoose.Schema({
  creator:{
    type: String,
    required: [true, 'user not found']
  },
  name:{
    type: String,
    required: [true, 'Room Name must be filled'],
    unique: true
  }
}, 
{
  timestamps: true
});

// create room model
const Room = mongoose.model('Room', RoomSchema)
// export module
module.exports = Room