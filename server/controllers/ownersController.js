const ownerService = require("../services/ownerService");

class OwnerController {

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
      const labels = await ownerService.getAll();
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
      const response = await ownerService.update(id, label, user);
      return res.json(response);
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
}



module.exports = new OwnerController();