const LogsService = require("../services/logsService");

class LogsController {

  async getAll(req, res) {
    try {
      console.log('LogsController')
      const countries = await LogsService.getAll();
      return res.json(countries);
    } catch (e) {
      res.status(500).json(e)
    }
  }
}

module.exports = new LogsController();