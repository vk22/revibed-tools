const Countries = require("../models/countries-model");

class countryService {
/// Add Country
async add (country) {
  console.log('country ', country)
  try {
    const findCountry = await Countries.findOne({ name: country });
    if (findCountry) {
      findCountry.count += 1
      let saveCountry = await findCountry.save()
      console.log('saveCountry ', saveCountry)

      if (saveCountry) {
        return true
      } else {
        return false
      }
      
    } else {
      const newCountryData = new Countries({
        name: country,
        count: 0
      })
      let saveCountry = await newCountryData.save()
      console.log('saveCountry ', saveCountry)
  
      if (saveCountry) {
        return true
      } else {
        return false
      }
    }
    
  } catch (error) {
    console.log('error ', error)
  }

}

/// Get Countries 
async getAll () {
  console.log('getCountries')
  // console.log('releasesController ', releasesController)
  try {
    const countries = await Countries.find({}).sort({ _id: -1 });
    if (!countries) {
      return {success: false, message: `Ничего не найдено`}
    }
    return { success: true, countries: countries };
  } catch (e) {
    console.log(e)
    return { success: false, message: `Access Error`}
  }
}

}





module.exports = new countryService();
