const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema
const UsersSchema = new Schema({
  username: {
    type: String
  },
  usergroup: {
    type: String
  },
  email: {
    type: String
  },
  confirmkey: {
    type: String
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  logs: {
    type: Array
  }
})

UsersSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UsersSchema.virtual("password").set(function(value) {
  console.log('virtual ', value)
  this.passwordHash = bcrypt.hashSync(value, 12);
  console.log('this.passwordHash ', this.passwordHash )
});

const UsersModel = mongoose.model('users', UsersSchema)
module.exports = UsersModel