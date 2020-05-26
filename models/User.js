/*this is our schema */
var mongoose = require('mongoose');
//const bcrypt = require('bcrypt');//hashing our password

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


var userSchema = new mongoose.Schema({
  firstname: {
  type: String,
 
},

secondname: {
  type: String,

},

EnteryNo: {
  type: Number,
},
Dateofbirth: {
  type: String,
  
},
gender:{
  type: String,
},
txtEmail: {
  type: String,
 
},
txtPhone: {
  type: String,

},
subject: {
  type: String,
  }

});
var InsertRecord = mongoose.model('InsertRecord', userSchema);
module.exports = InsertRecord;

