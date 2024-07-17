const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NewSchema = new Schema({
  id: {
    type: Number
  },
  name: {
    type: String,
  },
  uri: {
    type: String
  },
  status: {
    type: String
  },
  statusContact: {
    type: String,
    default: 'not_contacted'
  },
  comment: {
    type: String
  },
  contacts: {
    type: Array
  },
  notes: [{
    type: String,
  }],
  dataAdded: {
    type: Date
  }
})
const NewModel = mongoose.model('owners', NewSchema)
module.exports = NewModel