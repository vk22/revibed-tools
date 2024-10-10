const TracksService = require("../services/tracksService");

class TracksController {

  async create(req, res) {

    try {
      const release = await TracksService.create(req.body)
      res.json(release)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getAll(req, res) {
    try {
      const releases = await TracksService.getAll();
      return res.json(releases);
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async getByRelease(req, res) {
    try {
      const releaseID = req.params.id
      const response = await TracksService.get(releaseID);
      return res.json(response);
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async update(req, res) {
    console.log('track update req.body ', req.body)
    try {
      const id = req.params.id
      const track = req.body.track
      const user = req.body.user
      const response = await TracksService.update(id, track, user);
      return res.json(response);
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
  async updateByReleaseID(req, res) {
    //console.log('updateByReleaseID req.body ', req.body)
    try {
      const releases = req.body
      const response = await TracksService.updateByReleaseID(releases);
      return res.json(response);
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
  async export(req, res) {

    try {
      const releases = await TracksService.export(req.body);
      const csv = new ObjectsToCsv(releases);
      await csv.toDisk('./export/export-releases.csv');
      res.download(exportFolder + 'export-tracks.csv')
      return res.json({success: true});
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
  async delete(req, res) {
    try {
      const response = await TracksService.delete(req.params.id);
      return res.json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }
  
}

module.exports = new TracksController();