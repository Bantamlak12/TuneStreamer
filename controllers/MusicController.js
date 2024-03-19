const Music = require('../models/Music');
const fs = require('fs');
const path = require('path');

class MusicController {
  // UPLOADING A MUSIC
  static async addMusic(req, res) {
    try {
      // Check if audioFile and coverImage exist in req.files
      if (!req.files || !req.files.audioFile || !req.files.coverImage) {
        return res
          .status(400)
          .json({ error: 'Audio file and cover image are required' });
      }

      // Get file data and content type from Multer
      const audioFile = req.files.audioFile[0];
      const coverImage = req.files.coverImage[0];

      // Create the new music object
      const newMusic = new Music({
        audioFile: `/uploads/${audioFile.filename}`,
        coverImage: `/uploads/${coverImage.filename}`,
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
        genre: req.body.genre,
        releaseYear: req.body.releaseYear,
        duration: req.body.duration,
        trackNumber: req.body.trackNumber,
        composer: req.body.composer,
        language: req.body.composer,
        lyric: req.body.lyric,
        lyricist: req.body.lyricist,
        fileSize: req.body.fileSize,
        licence: req.body.fileSize,
        additionalNote: req.body.additionalNote,
      });

      await newMusic.save();

      return res
        .status(201)
        .json({ message: 'Music added to database successfully' });
    } catch (error) {
      console.log(`Error uploading a music: ${error.message}`);
      return res
        .status(500)
        .json({ error: 'An error occured while uploading a music' });
    }
  }

  // GET ALL MUSICS
  static async deleteMusic(req, res) {
    try {
      const { songId, imageURL, musicURL } = req.body;

      const deletedMusic = await Music.findOneAndDelete({
        _id: songId,
      });
      if (!deletedMusic) {
        return res.status(404).json({ error: 'Music not found' });
      }

      // Delete the music data from local storage
      if (imageURL) {
        const imagePath = path.join(__dirname, '../public', imageURL);
        fs.unlinkSync(imagePath);
      }

      if (musicURL) {
        const musicpath = path.join(__dirname, '../public', musicURL);
        fs.unlinkSync(musicpath);
      }

      return res.status(200).json({ message: 'Music deleted successfully' });
    } catch (error) {
      console.log(`Error getting all musics: ${error.message}`);
      return res
        .status(500)
        .json({ error: 'An error occured while getting all musics' });
    }
  }
}

module.exports = MusicController;
