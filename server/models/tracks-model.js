const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NewSchema = new Schema({
  releaseID: {
    type: Number
  },
  position: {
    type: String
  },
  title: {
    type: String,
  },
  authors: {
    type: Array,
    default: []
  },
  composers: {
    type: Array,
    default: []
  },

})
const NewModel = mongoose.model('tracks', NewSchema)
module.exports = NewModel