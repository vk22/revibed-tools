const Tracks = require("../models/tracks-model");
// const releaseService = require("./releaseService");
// const discogsService = require("./discogsService");

class Trackservice {

  /// Get Tracks 
  async getAll() {
    console.log('Tracks getAll')
    // console.log('releasesController ', releasesController)
    try {
      const tracks = await Tracks.find({}).sort({ _id: -1 });
      if (!tracks) {
        return { success: false, message: `Ничего не найдено` }
      }

      // const tracksUpadated = tracks.reduce((acc, item) => {
      //   let includes = acc.includes(item.releaseID)
      //   if (!includes) {
      //     acc.push(item.releaseID)
      //   }
      //   return acc
      // }, [])

      // console.log('tracksUpadated ', tracksUpadated)

      return { success: true, tracks: tracks };
    } catch (e) {
      console.log(e)
      return { success: false, message: `Access Error` }
    }
  }

  /// Get Tracks 
  async get(releaseID) {
    console.log('Track of relealse')
    // console.log('releasesController ', releasesController)
    try {
      const tracks = await Tracks.find({releaseID: releaseID}).sort({ _id: 1 });
      if (!tracks) {
        return { success: false, message: `Ничего не найдено` }
      }
      return { success: true, tracks: tracks };
    } catch (e) {
      console.log(e)
      return { success: false, message: `Access Error` }
    }
  }

  /// Add Youtube
  async create(data) {
    const { releaseID, position, title, authors, composers } = data
    try {
      const checkIfNotExist = await Tracks.findOne({ releaseID: releaseID, position: position, title: title });
      if (!checkIfNotExist) {
        const newTrack = new Tracks({
          releaseID: releaseID,
          position: position,
          title: title,
          authors: [],
          composers: []
        })
        const saveData = await newTrack.save()
        console.log('saveData ', saveData)
      } else {
        return {
          success: false,
          message: `Track already exist!`
        }
      }
    } catch (error) {
      console.log(error)
    }

  }

  /// Edit Youtube 
  async update(id, track) {
    console.log('edit Track ', id)
    try {
      const trackDB = await Tracks.findById(id);

      if (!trackDB) {
        return { success: false, message: `Ничего не найдено` }
      } else {
        if (trackDB.position) {
          trackDB.position = youtube.position
        }
        if (trackDB.title) {
          trackDB.title = youtube.title
        }
        if (trackDB.authors) {
          trackDB.authors = youtube.authors
        }
        if (trackDB.composers) {
          trackDB.composers = youtube.composers
        }

        const saveItem = await trackDB.save()

        if (!saveItem) {
          console.log(err)
          return {
            success: false,
            message: `Track not saved!`
          }
        } else {
          return {
            success: true,
            message: `Track with ID_${saveItem._id} saved!`,
          }
        }
      }

    } catch (e) {
      console.log(e)
      return { success: false, message: `Access Error` }
    }
  }

  /// Delete Track
  async delete(id) {
    console.log('videoId ', videoId)
    let deleteItem = await Tracks.deleteOne({ _id: id });
    console.log('deleteItem ', deleteItem)
    if (deleteItem) {
      return {
        success: true,
        message: `delete Track Done!`
      }
    } else {
      return {
        success: false,
        message: `Smth wrong`
      }

    }
  }
}


module.exports = new Trackservice();
