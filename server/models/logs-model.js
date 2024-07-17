const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NewSchema = new Schema({
  date: {
    type: String
  },
  message: {
    type: String,
  }
})
const NewModel = mongoose.model('logs', NewSchema)
module.exports = NewModel