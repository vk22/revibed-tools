const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NewSchema = new Schema({
  id: {
    type: Number
  },
  name: {
    type: String,
    //unique: true
  },
  count: {
    type: Number
  }
})
const NewModel = mongoose.model('countries', NewSchema)
module.exports = NewModel