const Artists = require("../models/artists-model");

const releaseService = require("./releaseService");
const discogsService = require("./discogsService");
const userService = require("./userService");

const sleep = ms => new Promise(r => setTimeout(r, ms))
const generateID = () => {
  return Math.floor(Math.random() * 1000000000)
}

class ArtistService {

  /// Add Artist
  async create(data) {

    let artist = data.artist;
    //artist.id = generateID()

    console.log('artist ', artist)

    try {
      const newArtistData = new Artists(artist)
      let saveArtist = await newArtistData.save()
      console.log('saveArtist ', saveArtist)

      if (saveArtist) {
        return {
          success: true,
          message: `addArtist Done!`
        }
      } else {
        return {
          success: false,
          message: `Smth wrong`
        }
      }
    } catch (error) {
      console.log('error ', error)
      return {
        success: false,
        message: `Smth wrong`
      }
    }
  }

  /// Get Artists 
  async getAll() {
    console.log('getArtists')
    // console.log('releaseService ', releaseService)
    try {
      const artists = await Artists.find({}).sort({ _id: -1 });
      //await artistsHandle2(artists)
      if (!artists) {
        return { success: false, message: `Ничего не найдено` }
      }
      return { success: true, artists: artists };
    } catch (e) {
      console.log(e)
      return { success: false, message: `Access Error` }
    }
  }

  async artistsHandle(artists) {
    for (let artist of artists) {
      let artistDataExt = await discogsService.getArtistData(artist.id)
      console.log('artistDataExt ', artistDataExt.name)
      if (artistDataExt) {
        console.log('artistDataExt ', artistDataExt.aliases)
        if (artistDataExt.aliases && artistDataExt.aliases.length) {
          /// 1
          let itemFromDB = await Artists.findOne({ id: artistDataExt.id });
          console.log('itemFromDB ', itemFromDB.name)
          if (!itemFromDB) {
            return false
          } else {
            itemFromDB.aliases = artistDataExt.aliases
            await itemFromDB.save()
            console.log('aliases saved')
          }
          /// 2
          for (let alias of artistDataExt.aliases) {
            let checkIfExist = await Artists.findOne({ id: alias.id });
            if (!checkIfExist) {
              let artistDataExt2 = await discogsService.getArtistData(alias.id)
              console.log('artistDataExt2', artistDataExt2)
              if (artistDataExt2 !== 'error') {
                let newArtistData = new Artists(artistDataExt2)
                await newArtistData.save()
                console.log('newArtistData saved')
                await sleep(2000)
              }
            }
          }
        }
      }
      await sleep(2000)
    }
  }
  async artistsHandle2(artists) {
    for (let artist of artists) {

      if (artist.aliases.length) {
        console.log('artist ', artist)
        if (artist.status !== 'default') {
          for (let alias of artist.aliases) {
            let aliasData = await Artists.findOne({ id: alias.id });
            aliasData.status = artist.status
            await aliasData.save()
          }
        }
        if (artist.statusContact !== 'not_contacted') {
          for (let alias of artist.aliases) {
            let aliasData = await Artists.findOne({ id: alias.id });
            aliasData.statusContact = artist.statusContact
            await aliasData.save()
          }
        }
      }
    }
  }

  /// Edit Artist 
  async update(id, artist, user) {
    console.log('editArtist ', id)
    let newArtistData = artist
    try {
      const itemFromDB = await Artists.findById(id);
      console.log('itemFromDB ', itemFromDB)
      if (!itemFromDB) {
        return { success: false, message: `Ничего не найдено` }
      } else {
        if (newArtistData.name) {
          itemFromDB.name = newArtistData.name
        }
        if (newArtistData.status) {
          itemFromDB.status = newArtistData.status
        }
        if (newArtistData.statusContact) {
          itemFromDB.statusContact = newArtistData.statusContact
        }
        if (newArtistData.releases) {
          itemFromDB.releases = newArtistData.releases
        }
        if (newArtistData.subreleases) {
          itemFromDB.subreleases = newArtistData.subreleases
        }

        if (newArtistData.contacts) {
          itemFromDB.contacts = newArtistData.contacts
        }

        itemFromDB.lastUpdate = {
          user: user,
          date: Date.parse(new Date())
        }

        let saveItem = await itemFromDB.save()

        //// update releases statuses
        if (itemFromDB.releases.length) {
          let data = { prop: 'statusArtist', value: itemFromDB.status }
          for (let releaseID of itemFromDB.releases) {
            await releaseService.releaseEditOneProp(releaseID, data)
          }
        }

        /// update aliases statuses
        if (itemFromDB.aliases.length) {
          for (let alias of itemFromDB.aliases) {
            let aliasData = await Artists.findOne({ id: alias.id });
            aliasData.status = itemFromDB.status
            await aliasData.save()

            //// update aliases releases statuses
            let data = { prop: 'statusArtist', value: aliasData.status }
            for (let releaseID of aliasData.releases) {
              await releaseService.releaseEditOneProp(releaseID, data)
            }
          }

          for (let alias of itemFromDB.aliases) {
            let aliasData = await Artists.findOne({ id: alias.id });
            aliasData.statusContact = itemFromDB.statusContact
            await aliasData.save()
          }

        }

        if (!saveItem) {
          console.log(err)
          return {
            success: false,
            message: `artist not saved!`
          }
        } else {
          /// user log
          if (user) {
            userService.addLog({
              username: user,
              log: {
                section: 'labels',
                pageID: saveItem._id,
                date: Date.parse(new Date())
              }
            })
          }
          return {
            success: true,
            message: `artist with ID_${saveItem._id} saved!`,
          }
        }
      }
    } catch (e) {
      console.log(e)
      return { success: false, message: `Access Error` }
    }
  }


}

module.exports = new ArtistService();
