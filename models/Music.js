const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  audioFile: {
    type: String,
    trim: true,
  },
  coverImage: {
    type: String,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  artist: {
    type: String,
    trim: true,
  },
  album: {
    type: String,
    trim: true,
  },
  genre: {
    type: String,
    trim: true,
  },
  releaseYear: {
    type: String,
  },
  duration: {
    type: String,
    trim: true,
  },
  trackNumber: {
    type: Number,
    trim: true,
  },
  composers: {
    type: [String],
    trim: true,
  },
  language: {
    type: String,
    trim: true,
  },
  lyric: {
    type: String,
    trim: true,
  },
  lyricists: {
    type: [String],
    trim: true,
  },
  fileSize: {
    type: String,
    trim: true,
  },
  licenceInformation: {
    type: String,
    trim: true,
  },
  additionalNote: {
    type: String,
    trim: true,
  },
});

const Music = new mongoose.model('Music', musicSchema);

module.exports = Music;
