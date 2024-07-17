const Distributors = require("../models/distributors-model");
const Owners = require("../models/owners-model");

class DistributorService {
  /// Add Distributor
  async createDistributor(data) {

    try {

      let distributor = data;
      //console.log('distributor ', distributor)
      let checkIfNotExist = await Distributors.findOne({ name: distributor.name });
      //console.log('checkIfNotExist ', checkIfNotExist)
      if (!checkIfNotExist) {
        let lastPost = await Distributors.findOne({}, {}, { sort: { 'id': -1 } });
        //console.log('lastPost ', lastPost)
        let lastID = (lastPost) ? lastPost.id + 1 : 1
        let newDistributor = {
          id: lastID,
          name: distributor.name ? distributor.name : '',
          status: 'default',
          comment: distributor.comment ? distributor.comment : '',
          contacts: distributor.contacts ? distributor.contacts : [],
          dataAdded: Date.parse(new Date()),
        }
        const newDistributorData = new Distributors(newDistributor)
        let saveDistributor = await newDistributorData.save()
        //console.log('saveDistributor ', saveDistributor)

        if (!saveDistributor) {
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
  /// Add Owner
  async createOwner(data) {
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

  async checkCopyrightOwners(data) {
    console.log('data', data)
    for (let item of data) {
      if (item.distributor.length) {
        for (let oneDist of item.distributor) {
          if (oneDist !== '') {
            let oneDistForSave = {
              name: oneDist.trimStart().trimEnd()
            }
            await this.createDistributor(oneDistForSave)
          }

        }
      }
      if (item.label.length) {
        for (let oneDist of item.label) {
          if (oneDist !== '') {
            let oneDistForSave = {
              name: oneDist.trimStart().trimEnd()
            }
            await this.createOwner(oneDistForSave)
          }

        }
      }
    }

  }

  /// Get Distributors 
  async getAll() {
    console.log('getDistributors')
    try {
      const distributors = await Distributors.find({}).sort({ _id: -1 });
      if (!distributors) {
        return { success: false, message: `Ничего не найдено` }
      }
      return { success: true, distributors: distributors };
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
      const labelOne = await Distributors.findById(id);
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
          return{
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





module.exports = new DistributorService();
