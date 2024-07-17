
const Discogs = require("disconnect").Client;
const db = new Discogs({
  consumerKey: "EZWmCxdwZuUQCTmUbfRY",
  consumerSecret: "tyoPkXCrZTCqIlFDaVIWeZkwTeMaCbSm",
}).database();

class DiscogsService {
  constructor() {
  }

  // async getLabelData(id, labels) {
  //   try {
  //     const data = await db.getLabel(id);
  //     console.log('getLabelData ', data.name)
  //     /// check
  //     let checkIfExist = labels.find(item => item.id === data.id)
  //     if (checkIfExist) {
  //       return labels
  //     } else {
  //       labels.push(data)
  //       if (data.parent_label) {
  //         return await getLabelData(data.parent_label.id, labels)
  //       } else {
  //         console.log('Thats all!', labels.length)
  //         return labels;
  //       }
  //     }
  
  //   } catch (err) {
  //     console.log("error getReleaseData", err, id);
  //     return false
  //   }
  // }
  
  async getLabelData(id) {
    try {
      const data = await db.getLabel(id);
      return data;
    } catch (err) {
      console.log("error getLabel", err, id);
      return false
    }
  }

  async getReleaseData(releaseID) {
    console.log("getReleaseData", releaseID);
    try {
      const data = await db.getRelease(releaseID);
      console.log("data", data);
      return data;
    } catch (err) {
      console.log("error getReleaseData", err, releaseID);
      return false
    }
  }

  async getArtistData(artistID) {
    try {
      const data = await db.getArtist(artistID);
      return data;
    } catch (err) {
      console.log("error getArtistData", err.message, artistID);
      return 'error'
    }
  }

  async searchByTitles(query) {
    try {
      let response = await db.search(query);
      console.log('query ', query)
      if (response) {
        if (response.results.length) {
          let resultFinal = undefined;
          let result = response.results[0];
          console.log('type ', result.type)
          if (result.type === 'master') {
            let getMaster = await db.getMaster(result.id);
            let getRelease = await db.getRelease(getMaster.main_youtube);
            let resultID = getRelease.id
            let resultTitle = getRelease.title
            resultFinal = resultID
          } else {
            let resultID = result.id
            let resultTitle = result.title
            resultFinal = resultID
          }
          console.log('resultFinal ', resultFinal)
          return resultFinal
        }

      }

    } catch (error) {
      console.log('error ', error)
      return undefined
    }

  }

}


module.exports = new DiscogsService();
