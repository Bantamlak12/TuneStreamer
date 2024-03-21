const Music = require('../models/Music');
const fs = require('fs');
const { ObjectId } = require('mongodb');
const path = require('path');

class MusicController {
  // POST /admin/musics
  static async addMusic(req, res) {
    try {
      // Check if audioFile and coverImage exist in req.files
      if (!req.files || !req.files.audioFile || !req.files.coverImage) {
        return res.status(400).json({ error: 'Audio file and cover image are required' });
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
        composers: req.body.composers,
        language: req.body.language,
        lyric: req.body.lyric,
        lyricists: req.body.lyricists,
        fileSize: req.body.fileSize,
        licence: req.body.licence,
        additionalNote: req.body.additionalNote,
      });

      const addedMusic = await newMusic.save();

      return res.status(201).json(addedMusic);
    } catch (error) {
      console.log(`Error uploading a music: ${error.message}`);
      return res.status(500).json({ error: 'An error occured while uploading a music' });
    }
  }

  // DELETE /admin/musics/:id
  static async deleteMusic(req, res) {
    try {
      const id = req.params.id;

      const { imageURL, musicURL } = req.body;

      const deletedMusic = await Music.findOneAndDelete({
        _id: id,
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

      return res.status(204).json(deletedMusic);
    } catch (error) {
      console.log(`Error getting all musics: ${error.message}`);
      return res.status(500).json({ error: 'An error occured while getting all musics' });
    }
  }

  // DELETE /admin/musics
  static async deleteAllMusics(req, res) {
    try {
      // Delete music documents from the mongoose database
      await Music.deleteMany({});

      // Delete music documents like image and audio file from local storage
      const uploadsDirectory = path.join(__dirname, '../public', '/uploads');
      if (fs.existsSync(uploadsDirectory)) {
        fs.readdirSync(uploadsDirectory).forEach((file) => {
          const filePath = path.join(uploadsDirectory, file);
          fs.unlinkSync(filePath);
        });
      }

      return res.status(204).json({ message: 'All musics data deleted successfully' });
    } catch (error) {
      console.log(`Error deleting all musics: ${error.message}`);
      return res
        .status(500)
        .json({ error: 'An error occured while deleting all musics' });
    }
  }

  // GET /musics/search
  static async searchMusic(req, res) {
    try {
      const { searchingWord } = req.body;
      let searchResult;

      if (searchingWord) {
        searchResult = await Music.find({
          $or: [{ title: searchingWord }, { artist: searchingWord }],
        });
      } else {
        searchResult = await Music.find({});
      }

      if (searchResult.length === 0) {
        searchResult = await Music.find({});
      }

      return res.status(200).json(searchResult);
    } catch (error) {
      console.log(`Error while searching a music: ${error.message}`);
      return res.status(500).json({ error: 'An error occured while searching a music' });
    }
  }

  // POST /admin/musics/:id
  static async getMusicById(req, res) {
    try {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ObjectId' });
      }

      const music = await Music.find({ _id: id });
      if (!music) {
        return res.status(404).json({ error: 'Music not found' });
      }

      return res.status(200).json(music);
    } catch (error) {
      console.log(`Error while searching a music by Id: ${error.message}`);
      return res
        .status(500)
        .json({ error: 'An error occured while searching a music by Id' });
    }
  }

  // GET /musics
  static async getAllMusics(req, res) {
    const musics = await Music.find({});
    res.status(200).json(musics);
  }

  // PUT /musics/music/:id
  static async updateMusic(req, res) {
    try {
      const id = req.params.id;

      const updatedMusic = await Music.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            title: req.body.title,
            artist: req.body.artist,
            album: req.body.album,
            genre: req.body.genre,
            releaseYear: req.body.releaseYear,
            duration: req.body.duration,
            trackNumber: req.body.trackNumber,
            composers: req.body.composers,
            language: req.body.language,
            lyric: req.body.lyric,
            lyricists: req.body.lyricists,
            fileSize: req.body.fileSize,
            licence: req.body.licence,
            additionalNote: req.body.additionalNote,
          },
        },
        { new: true, runValidators: true }
      );

      if (!updatedMusic) {
        return res.status(404).json({ error: 'Music not found' });
      }

      return res.status(200).json(updatedMusic);
    } catch (error) {
      console.log(`Error while updating a music: ${error.message}`);
      return res.status(500).json({ error: 'An error occured while updating a music' });
    }
  }
}

module.exports = MusicController;
