// use mongoose odm library
const mongoose = require('mongoose');
// unique validator library to identify duplicate value
const uniqueValidator = require('mongoose-unique-validator');
// validator
const {isEmail} = require('validator')
// bcrypt for hashing
const bcrypt = require('bcrypt')

const User_AdminSchema = new mongoose.Schema({
  email:{
    type: String,
    required: [true, 'email must be filled'],
    unique: true,
    validator: [isEmail, 'please enter a valid email']
  },
  password:{
    type: String,
    required: [true, 'password must be filled']
  },
  role:{
    type: String,
    required: [true, 'role must be filled']
  }
});
// use unique validator on username
User_AdminSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });
// hash password before saving data to database
User_AdminSchema.pre('save', async function (next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt)
  next();
})
// static function for login verification
User_AdminSchema.statics.login = async function (email, password){
  const user = await this.findOne({email});
  if (user){
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user;
    }
    throw Error('incorrect password')
  }
  throw Error('incorrect email')
}

// create user_admin model using user_adminSchema
const User_Admin = mongoose.model('User_Admin', User_AdminSchema);

module.exports = User_Admin