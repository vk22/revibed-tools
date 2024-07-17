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
  uri: {
    type: String
  },
  profile: {
    type: String
  },
  parent_label: {
    type: Object
  },
  main_parent_label: {
    type: Object
  },
  main_parent_label_new: {
    type: Object
  },
  sublabels: {
    type: Array
  },
  sublabelsExist: {
    type: Array
  },
  status: {
    type: String,
    default: 'default'
  },
  statusContact: {
    type: String,
    default: 'not_contacted'
  },
  statusYoutube: {
    type: String,
    default: 'default'
  },
  contact_email: {
    type: String
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
  },
  releases: {
    type: Array
  },
  subreleases: {
    type: Array
  },
  count: {
    type: Number
  },
  countReleases: {
    type: Number
  },
  lastUpdate: {
    type: Object
  }
})
const NewModel = mongoose.model('labels', NewSchema)
module.exports = NewModel