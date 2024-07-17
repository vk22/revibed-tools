const Artists = require("../models/artists-model");
const ObjectsToCsv = require('objects-to-csv');
const exportFolder = '/var/www/artists/www/server/export/'
const releasesController = require("../controllers/releasesController");
const discogsController = require("../controllers/discogsController");
const usersController = require("./usersController");

const sleep = ms => new Promise(r => setTimeout(r, ms))
const generateID = () => {
  return Math.floor(Math.random() * 1000000000)
}

/// Add Artist
const addArtist = async (req, res, next) => {

  if (req.headers['x-api-key'] != 'l74b9ba9qmext9a6ulniigq8') {
    return res.status(403).send({success: false, msg: 'Unauthorized'});
  }

  let artist = req.body.artist;
  //artist.id = generateID()

  console.log('artist ', artist)
  
  try {
    const newArtistData = new Artists(artist)
    let saveArtist = await newArtistData.save()
    console.log('saveArtist ', saveArtist)

    if (saveArtist) {
      res.send({
        success: true,
        message: `addArtist Done!`
      })
    } else {
      res.send({
        success: false,
        message: `Smth wrong`
      })
    }
  } catch (error) {
    console.log('error ', error)
  }

}

/// Get Artists 
const getArtists = async (req, res, next) => {
  console.log('getArtists')
  // console.log('releasesController ', releasesController)
  try {
    const artists = await Artists.find({}).sort({ _id: -1 });
    //await artistsHandle2(artists)
    if (!artists) {
      return res.status(400).json({message: `Ничего не найдено`})
    }
    return res.json({ success: true, artists: artists });
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: "Access Error" });
  }
}

const artistsHandle = async (artists) => {
  for (let artist of artists) {
    let artistDataExt = await discogsController.getArtistData(artist.id)
    console.log('artistDataExt ', artistDataExt.name)
    if (artistDataExt) {
      console.log('artistDataExt ', artistDataExt.aliases)
      if (artistDataExt.aliases && artistDataExt.aliases.length) {
        /// 1
        let itemFromDB = await Artists.findOne({id: artistDataExt.id});
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
          let checkIfExist = await Artists.findOne({id: alias.id});
          if (!checkIfExist) {
            let artistDataExt2 = await discogsController.getArtistData(alias.id)
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
const artistsHandle2 = async (artists) => {
  for (let artist of artists) {
    
    if (artist.aliases.length) {
      console.log('artist ', artist)
      if (artist.status !== 'default') {
        for (let alias of artist.aliases) {
          let aliasData = await Artists.findOne({id: alias.id});
          aliasData.status = artist.status
          await aliasData.save()
        }
      }
      if (artist.statusContact !== 'not_contacted') {
        for (let alias of artist.aliases) {
          let aliasData = await Artists.findOne({id: alias.id});
          aliasData.statusContact = artist.statusContact
          await aliasData.save()
        }
      }
    }
  }
}

/// Edit Artist 
const editArtist = async (req, res, next) => {
console.log('editArtist ', req.params.id)
let user = req.body.user
let newArtistData = req.body.artist
  try {
    const itemFromDB = await Artists.findById(req.params.id);
    console.log('itemFromDB ', itemFromDB)
    if (!itemFromDB) {
      return res.status(400).json({message: `Ничего не найдено`})
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
        let data = {prop: 'statusArtist', value: itemFromDB.status}
        for (let releaseID of itemFromDB.releases) {
          await releasesController.releaseEditOneProp(releaseID, data)
        }  
      }

      /// update aliases statuses
      if (itemFromDB.aliases.length) {
        for (let alias of itemFromDB.aliases) {
          let aliasData = await Artists.findOne({id: alias.id});
          aliasData.status = itemFromDB.status
          await aliasData.save()

          //// update aliases releases statuses
          let data = {prop: 'statusArtist', value: aliasData.status}
          for (let releaseID of aliasData.releases) {
            await releasesController.releaseEditOneProp(releaseID, data)
          }  
        }
      
        for (let alias of itemFromDB.aliases) {
          let aliasData = await Artists.findOne({id: alias.id});
          aliasData.statusContact = itemFromDB.statusContact
          await aliasData.save()
        }
        
      }

      if (!saveItem) {
        console.log(err)
        res.send({
          success: false,
          message: `artist not saved!`
        })
      } else {
        /// user log
        if (user) {
          usersController.addLog({
            username: user,
            log: {
              section: 'labels',
              pageID: saveItem._id,
              date: Date.parse(new Date())
            }
          })
        }
        res.send({
          success: true,
          message: `artist with ID_${saveItem._id} saved!`,
        })
      }
    }
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: "Access Error" });
  }
}

/// Edit Artist 
const removeParentArtist = async (req, res, next) => {
  console.log('removeParentArtist ', req.params.id)
  let artistData = req.body.artist
  let artistID = artistData.id
  let parentArtist = artistData.parent_artist
  let parentArtistID = parentArtist.id
  console.log('artistData ', artistData)
  console.log('parentArtist ', parentArtist)
    try {

      const artistParentOne = await Artists.findOneAndUpdate({id: parentArtistID}, {subreleases: []});
      console.log('artistParentOne ', artistParentOne)

      const itemFromDB = await Artists.findById(req.params.id);
      console.log('itemFromDB ', itemFromDB)
      if (!itemFromDB) {
        return res.status(400).json({message: `Ничего не найдено`})
      } else {
        
        itemFromDB.parent_artist = undefined
        
        // console.log('itemFromDB2 ', itemFromDB)
        let saveItem = await itemFromDB.save()
        await releasesController.releasesToArtists(artistID, parentArtistID)
  
        if (!saveItem) {
          console.log(err)
          res.send({
            success: false,
            message: `artist not saved!`
          })
        } else {
          res.send({
            success: true,
            message: `artist with ID_${saveItem._id} saved!`,
          })
        }
      }
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: "Access Error" });
    }
  }

/// Export CSV
const exportArtists = async (req, res, next) => {
  const data = req.body.artists;
  console.log('data ', data)
  let artists = await Artists.find().where('id').in(data).sort({ _id: -1 })
  console.log('artists ', artists)

  artists = artists.map (item => {
    return {
      name: item.name,
      uri: item.uri, 
      subartists: item.subartists
    }
  })
  const csv = new ObjectsToCsv(artists);
  await csv.toDisk('./export/export-artists.csv');

  res.download(exportFolder + 'export-artists.csv')

  // res.send({
  //   success: true,
  //   file: exportFolder + 'export-artists.csv'
  // })
  
  // if (saveProject) {
  //   const projectFolder = projectFolderPath+saveProject.id;
  //   console.log('projectFolder ', projectFolder)
  //   fs.mkdirSync(projectFolder, { recursive: true });
  //   res.send({
  //     success: true,
  //     message: `Project with ID_${saveProject._id} saved successfully!`,
  //     projectID: saveProject.id
  //   })
  // } else {
  //   res.send({
  //     success: false,
  //     message: `Project not saved! Maybe duplicate title error...`
  //   })
  // } 
}

const getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = {
  getArtists,
  editArtist,
  exportArtists,
  addArtist,
  removeParentArtist
};
