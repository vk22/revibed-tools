const Youtubes = require("../models/youtube-model");
const releaseService = require("./releaseService");
const discogsService = require("./discogsService");

class YoutubeService {
  /// Get Youtubes 
  async getAll() {
    console.log('Youtubes')
    // console.log('releasesController ', releasesController)
    try {
      const youtubes = await Youtubes.find({}).sort({ _id: -1 });
      if (!youtubes) {
        return { success: false, message: `Ничего не найдено` }
      }
      return { success: true, youtubes: youtubes };
    } catch (e) {
      console.log(e)
      return { success: false, message: `Access Error` }
    }
  }

  /// Add Youtube
  async create(data) {
    try {
      let newYoutube = data;
      console.log('newYoutube ', newYoutube)
      let checkIfNotExist = await Youtubes.findOne({ videoId: newYoutube.videoId });
      if (!checkIfNotExist) {
        let discogsRelease
        if (newYoutube.releaseID) {
          console.log('newYoutube.releaseID ', newYoutube.releaseID)
          discogsRelease = newYoutube.releaseID
        } else {
          discogsRelease = await discogsService.searchByTitles(newYoutube.title)
        }

        let newYoutubeItem = {
          videoId: newYoutube.videoId,
          title: newYoutube.title,
          publishedAt: newYoutube.publishedAt,
          thumbnails: newYoutube.thumbnails ? newYoutube.thumbnails : null,
          discogsRelease: discogsRelease
        }

        console.log('newYoutubeItem ', newYoutubeItem)

        const newYoutubeData = new Youtubes(newYoutubeItem)
        let saveData = await newYoutubeData.save()
        console.log('saveData ', saveData)

        if (saveData) {

          /// add YoutubeID to release
          let releaseID = +discogsRelease
          let data = { prop: 'youtubeVideoID', value: newYoutubeItem.videoId }
          console.log('add YoutubeID to release ', releaseID)
          console.log('add YoutubeID to release ', data)
          await releaseService.releaseEditOneProp(releaseID, data)

          return {
            success: true,
            message: `addYoutube Saved!`
          }

        }
      } else {
        return {
          success: false,
          message: `Youtube already exist!`
        }
      }
    } catch (error) {
      console.log(error)
    }

  }

  /// Edit Youtube 
  async update(id, youtube) {
    console.log('editYoutube ', id)
    try {
      const youtubeOne = await Youtubes.findById(id);
      // console.log('labelOne ', labelOne)

      if (!youtubeOne) {
        return { success: false, message: `Ничего не найдено` }
      } else {
        if (youtube.discogsRelease) {
          youtubeOne.discogsRelease = youtube.discogsRelease
        }

        let saveItem = await youtubeOne.save()


        /// add YoutubeID to release
        let releaseID = +youtube.discogsRelease
        let data = { prop: 'youtubeVideoID', value: youtubeOne.videoId }
        console.log('add YoutubeID to release ', releaseID)
        console.log('add YoutubeID to release ', data)
        await releasesController.releaseEditOneProp(releaseID, data)

        if (!saveItem) {
          console.log(err)
          return {
            success: false,
            message: `Youtube not saved!`
          }
        } else {
          return {
            success: true,
            message: `Youtube with ID_${saveItem._id} saved!`,
          }
        }
      }

    } catch (e) {
      console.log(e)
      return { success: false, message: `Access Error` }
    }
  }

  /// Delete Youtube
  async delete(videoId) {
    console.log('videoId ', videoId)
    let deleteItem = await Youtubes.deleteOne({ videoId: videoId });
    console.log('deleteItem ', deleteItem)
    if (deleteItem.deletedCount) {
      return {
        success: true,
        message: `deleteYoutube Done!`
      }
    } else {
      return {
        success: false,
        message: `Smth wrong`
      }

    }
  }
}


module.exports = new YoutubeService();
