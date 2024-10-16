const CountryService = require("../services/countryService");

class CountryController {

  async getAll(req, res) {
    try {
      const countries = await CountryService.getAll();
      return res.json(countries);
    } catch (e) {
      res.status(500).json(e)
    }
  }
}


module.exports = new CountryController();