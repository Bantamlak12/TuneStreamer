const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  audioFile: {
    data: Buffer,
    contentType: String,
    required: [true, 'A music should have an audio file'],
  },
  audioCover: {
    data: Buffer,
    contentType: String,
    required: [true, 'A music should have audio cover'],
  },
  title: {
    type: String,
    required: [true, 'A music should have a title'],
    trim: true,
  },
  artist: {
    type: String,
    required: [true, 'A music should have an artist'],
    trim: true,
  },
  album: {
    type: String,
    trim: true,
  },
  genre: {
    type: String,
    required: [true, 'A music should have an genre'],
    trim: true,
  },
  releaseYear: {
    type: data,
    required: [true, 'A music should have a release year'],
  },
  duration: {
    type: Number,
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
    required: [true, 'A music should have a language'],
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
  fileFormat: {
    type: String,
    required: [true, 'A music should have a file format'],
    trim: true,
  },
  fileSize: {
    type: Number,
    trim: true,
  },
  licenceInformation: {
    type: String,
    required: [true, 'A music should have a licence information'],
    trim: true,
  },
  additionalNote: {
    type: String,
    trim: true,
  },
});

const Music = new mongoose.model('Music', musicSchema);

module.exports = Music;
