const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NewSchema = new Schema({
  videoId: {
    type: String
  },
  thumbnails: {
    type: Object,
  },
  title: {
    type: String
  },
  publishedAt: {
    type: String
  },
  discogsRelease: {
    type: Number
  }
})
const NewModel = mongoose.model('youtubes', NewSchema)
module.exports = NewModel