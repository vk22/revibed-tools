const distributorService = require("../services/distributorService");

class DistributorController {

  // async create(req, res) {

  //   try {
  //     const label = await distributorService.create(req.body)
  //     res.json(label)
  //   } catch (e) {
  //     res.status(500).json(e)
  //   }
  // }

  async getAll(req, res) {
    try {
      const labels = await distributorService.getAll();
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
      const data = await distributorService.update(id, label, user);
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

module.exports = new DistributorController();