const YoutubeService = require("../services/youtubeService");

class ReleaseController {

  async create(req, res) {

    try {
      const label = await YoutubeService.create(req.body)
      res.json(label)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getAll(req, res) {
    // if (!checkHeaders(req)) {
    //   res.status(403).send({ success: false, msg: 'Unauthorized' });
    // }
    try {
      const data = await YoutubeService.getAll();
      return res.json(data);
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async update(req, res) {

    try {
      const id = req.params.id
      const youtube = req.body.youtube
      const user = req.body.user
      const data = await YoutubeService.update(id, youtube, user);
      return res.json(data);
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
  async delete(req, res) {

    try {
      const data = await YoutubeService.delete(req.params.id);
      return res.json(data)
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async removeParentLabel(req, res) {

    try {
      const data = await YoutubeService.removeParentLabel(req);
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