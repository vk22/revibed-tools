const ReleaseService = require("../services/releaseService");

class ReleaseController {

  async create(req, res) {

    try {
      const release = await ReleaseService.create(req.body)
      res.json(release)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getAll(req, res) {
    // if (!checkHeaders(req)) {
    //   res.status(403).send({ success: false, msg: 'Unauthorized' });
    // }
    try {
      const releases = await ReleaseService.getAll();
      return res.json(releases);
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async update(req, res) {

    try {
      const id = req.params.id
      const release = req.body.release
      const user = req.body.user
      const data = await ReleaseService.update(id, release, user);
      return res.json(data);
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
  async export(req, res) {

    try {
      const releases = await ReleaseService.export(req.body);

      const csv = new ObjectsToCsv(releases);
      await csv.toDisk('./export/export-releases.csv');
      res.download(exportFolder + 'export-releases.csv')

      return res.json(data);
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
  async delete(req, res) {

    try {
      const data = await ReleaseService.delete(req.params.id);
      return res.json(data)
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async addToRevibedMany(req, res) {

    try {
      const data = await ReleaseService.addToRevibedMany();
      return res.json(data);
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
  async putOnSale(req, res) {

    try {
      const data = await ReleaseService.putOnSale(req.body);
      return res.json(data);
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
  async checkRelease(req, res) {

    try {
      const data = await ReleaseService.checkRelease(req.body.releaseID);
      return res.json(data);
    } catch (e) {
      console.log('e.message ', e.message)
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