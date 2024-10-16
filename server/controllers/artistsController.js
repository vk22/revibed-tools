const ArtistService = require("../services/artistService");

class ArtistController {

  async create(req, res) {

    try {
      const artist = await ArtistService.create(req.body)
      res.json(artist)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getAll(req, res) {
    try {
      const artists = await ArtistService.getAll();
      return res.json(artists);
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async update(req, res) {

    try {
      const id = req.params.id
      const artist = req.body.artist
      const user = req.body.user
      const response = await ArtistService.update(id, artist, user);
      return res.json(response);
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
  async delete(req, res) {

    try {
      const response = await ArtistService.delete(req.params.id);
      return res.json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async removeParentLabel(req, res) {

    try {
      const response = await ArtistService.removeParentLabel(req);
      return res.json(response);
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
}


module.exports = new ArtistController();