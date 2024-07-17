const Owners = require("../models/owners-model");

class OwnerService {
  /// Add Owner
  async create(data) {
    try {

      let owner = data;
      //console.log('distributor ', distributor)
      let checkIfNotExist = await Owners.findOne({ name: owner.name });
      //console.log('checkIfNotExist ', checkIfNotExist)
      if (!checkIfNotExist) {
        let lastPost = await Owners.findOne({}, {}, { sort: { 'id': -1 } });
        //console.log('lastPost ', lastPost)
        let lastID = (lastPost) ? lastPost.id + 1 : 1
        let newDistributor = {
          id: lastID,
          name: owner.name ? owner.name : '',
          status: 'default',
          comment: owner.comment ? owner.comment : '',
          contacts: owner.contacts ? owner.contacts : [],
          dataAdded: Date.parse(new Date()),
        }
        const newDistributorData = new Owners(newDistributor)
        let saveOwner = await newDistributorData.save()
        console.log('saveOwner ', saveOwner)

        if (!saveOwner) {
          return true
        } else {
          return true
        }

      } else {
        return true
      }




    } catch (error) {
      console.log(error)
    }


  }

  /// Get Distributors 
  async getAll() {
    console.log('getDistributors')
    try {
      const owners = await Owners.find({}).sort({ _id: -1 });
      if (!owners) {
        return { success: false, message: `Ничего не найдено` }
      }
      return { success: true, owners: owners };
    } catch (e) {
      console.log(e)
      return { success: false, message: `Access Error` }
    }
  }

  /// Edit Distributor 
  async update(id) {
    console.log('editDistributor ', id)
    let newLabelData = req.body.label
    try {
      const labelOne = await Owners.findById(id);
      if (!labelOne) {
        return res.status(400).json({ message: `Ничего не найдено` })
      } else {
        if (newLabelData.name) {
          labelOne.name = newLabelData.name
        }
        if (newLabelData.status) {
          labelOne.status = newLabelData.status
        }
        if (newLabelData.statusContact) {
          labelOne.statusContact = newLabelData.statusContact
        }
        if (newLabelData.releases) {
          labelOne.releases = newLabelData.releases
        }
        if (newLabelData.subreleases) {
          labelOne.subreleases = newLabelData.subreleases
        }
        if (newLabelData.contacts) {
          labelOne.contacts = newLabelData.contacts
        }
        // console.log('labelOne2 ', labelOne)
        let saveItem = await labelOne.save()
        if (!saveItem) {
          console.log(err)
          return{
            success: false,
            message: `label not saved!`
          }
        } else {
          return {
            success: true,
            message: `label with ID_${saveItem._id} saved!`,
          }
        }
      }
    } catch (e) {
      console.log(e)
      return { success: false, message: `Access Error` }
    }
  }
}





module.exports = new OwnerService();
