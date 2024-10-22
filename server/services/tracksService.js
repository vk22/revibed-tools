const Tracks = require("../models/tracks-model");
const Releases = require("../models/releases-model");
const revibedService = require("./revibedService");
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

  /// Add track
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
        return {
          success: true,
          message: `Track created!`
        }
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

  /// Edit track 
  async update(id, track) {
    console.log('edit Track id', id)
    console.log('edit Track track ', track)
    try {
      const trackDB = await Tracks.findById(id);
      
      if (!trackDB) {
        return { success: false, message: `Ничего не найдено` }
      } else {
        if (trackDB.position) {
          trackDB.position = track.position
        }
        if (trackDB.title) {
          trackDB.title = track.title
        }
        if (trackDB.authors) {
          trackDB.authors = track.authors
        }
        if (trackDB.composers) {
          trackDB.composers = track.composers
        }

        const saveItem = await trackDB.save()

        ///
        const sendToRevibedRes = await this.sendToRevibed(track)
        console.log('sendToRevibedRes ', sendToRevibedRes)

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

  async updateByReleaseID(tracks) {
    for (let trackNew of tracks) {
      console.log('trackNew ', trackNew)
      const rvbdID = trackNew.id
      const title = trackNew.title
      const releaseFromDB = await Releases.findOne({"onRevibed.id": rvbdID});
      if (releaseFromDB) {
        const releaseID = releaseFromDB.releaseID
        if (releaseID) {
          const trackFromDB = await Tracks.findOne({releaseID: releaseID, title: title});
          if (trackFromDB) {
            console.log('trackFromDB ', trackFromDB)
            trackFromDB.authors = trackNew.authors
            trackFromDB.composers = trackNew.composers
            await trackFromDB.save()
          } 
        }

      }

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

  async sendToRevibed(track) {
    console.log('sendToRevibed')
    if (track.composers.length || track.authors.length) {
      const trackData = {
        "discogsReleaseId": track.releaseID,
        "position": track.position,
        "composers": track.composers,
        "authors": track.authors
      }
      const pushToRV = await revibedService.addTracksAuthors([trackData])
      console.log('pushToRV ', pushToRV)
      return pushToRV
    } else {
      return { message: 'No data to send' }
    }
  }
}


module.exports = new Trackservice();
