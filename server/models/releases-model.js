const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NewSchema = new Schema({
  releaseID: {
    type: Number
  },
  type: {
    type: String,
    default: 'goods'
    //unique: true
  },
  title: {
    type: String,
    //unique: true
  },
  artist: {
    type: String,
    //unique: true
  },
  artists: {
    type: Array
  },
  year: {
    type: Number,
  },
  country: {
    type: String,
    //unique: true
  },
  genres: {
    type: Array
  },
  styles: {
    type: Array
  },
  labelID: {
    type: Number,
    // unique: true
  },
  labelName: {
    type: String,
    //unique: true
  },
  labelParent: {
    type: Object,
    //unique: true
  },
  labelParentID: {
    type: Number,
    // unique: true
  },
  labelParentName: {
    type: String,
    //unique: true
  },
  labelLink: {
    type: String,
    //unique: true
  },
  youtubeVideoID: {
    type: String
  },
  youtubeCopyrightOwners: [
    {
      distributor: { type: Array },
      label: { type: Array }
    }
  ],
  youtubeCopyrightOwnersString: {
    type: Object
  },
  notes: [{
    type: String,
  }],
  updated: {
    type: Date
  },
  source: {
    type: String
  },
  quality: {
    type: String
  },
  onRevibed: {
    forSale: { type: Boolean },
    id: { type: String }
  },
  status: {
    type: String
  },
  statusYoutube: {
    type: String
  },
  statusDiscogs: {
    type: String
  },
  statusDistributor: {
    type: String
  },
  statusOwner: {
    type: String
  },
  statusVarious: {
    type: String
  },
  statusMain: {
    type: String
  },
  statusArtist: {
    type: String
  },
  lastUpdate: {
    type: Object
  }

})
const NewModel = mongoose.model('releases', NewSchema)
module.exports = NewModel