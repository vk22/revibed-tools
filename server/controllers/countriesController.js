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

function checkHeaders(req) {
  if (req.headers['x-api-key'] != 'l74b9ba9qmext9a6ulniigq8') {
    return false
  }
  return true
}

module.exports = new CountryController();