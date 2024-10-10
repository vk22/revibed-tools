const LabelService = require("../services/labelService");

class ReleaseController {

  async create(req, res) {
    console.log(' LabelController create ')
    try {
      const label = await LabelService.create(req.body)
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
      const labels = await LabelService.getAll();
      return res.json(labels);
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async update(req, res) {

    try {
      const id = req.params.id
      const label = req.body.label
      const user = req.body.user
      const response = await LabelService.update(id, label, user);
      return res.json(response);
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
  async export(req, res) {

    try {
      const labels = await LabelService.export(req.body);

      const csv = new ObjectsToCsv(labels);
      await csv.toDisk('./export/export-labels.csv');
      res.download(exportFolder + 'export-labels.csv')

      return res.json();
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
  async delete(req, res) {

    try {
      const response = await LabelService.delete(req.params.id);
      return res.json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async removeParentLabel(req, res) {

    try {
      const response = await LabelService.removeParentLabel(req);
      return res.json(response);
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
  async sublabelsExistUpdate(req, res) {
    try {
      const response = await LabelService.sublabelsExistUpdate();
      return res.json(response);
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
  async sublabelsStatusUpdate(req, res) {
    const parentLabelID = req.body.id
    try {
      const response = await LabelService.sublabelsStatusUpdate(parentLabelID);
      return res.json(response);
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