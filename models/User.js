/*this is our schema */
var mongoose = require('mongoose');
//const bcrypt = require('bcrypt');//hashing our password
let SALT=10;

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
   email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;

