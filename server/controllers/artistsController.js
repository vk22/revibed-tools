const ArtistService = require("../services/artistService");

class ReleaseController {

  async create(req, res) {

    try {
      const artist = await ArtistService.create(req.body)
      res.json(artist)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getAll(req, res) {
    // if (!checkHeaders(req)) {
    //   res.status(403).send({ success: false, msg: 'Unauthorized' });
    // }
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
      const data = await ArtistService.update(id, artist, user);
      return res.json(data);
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
  async delete(req, res) {

    try {
      const data = await ArtistService.delete(req.params.id);
      return res.json(data)
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async removeParentLabel(req, res) {

    try {
      const data = await ArtistService.removeParentLabel(req);
      return res.json(data);
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
}

function checkHeaders(req) {
  if (req.headers['x-api-key'] != 'l74b9ba9qmext9a6ulniigq8') {
    return false
  }
  return true
}

module.exports = new ReleaseController();