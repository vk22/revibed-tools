
const Releases = require("../models/releases-model");
const Labels = require("../models/labels-model");
const Artists = require("../models/artists-model");
const distributorsService = require("./distributorService");
const discogsService = require("./discogsService");
const revibedService = require("./revibedService");
const userService = require("./userService");
const fs = require('fs-extra');
const { parse } = require("csv-parse");
const EventEmitter = require("events");
const emitter = new EventEmitter();
const axios = require('axios');
const ApiError = require('../exceptions/api-error');

class ReleaseService {

  async create(data) {
    /// get Additional Data Of Release
    let newRelease = await this.getAdditionalDataOfRelease(data)
    console.log('addRelease ', newRelease)
    try {
      const findRelease = await Releases.findOne({ releaseID: +newRelease.releaseID });
      if (!findRelease) {
        const newReleaseData = new Releases(newRelease)
        const saveRelease = await newReleaseData.save()
        console.log('saveRelease ', saveRelease.id)

        /// After save
        if (saveRelease) {
          if (newRelease.labelID) {
            /// Get and Save Labels Chain
            await this.getAndSaveNewLabelsFromDiscogs(newRelease.labelID)

            /// Get Label Data 
            let firstLabelData = await Labels.findOne({ id: newRelease.labelID });
            let firstLabelStatus = (firstLabelData) ? firstLabelData.status : undefined

            /// Get Last Parent
            let findParentLabel = await this.getLastParentLabel(newRelease.labelID)
            let lastParentLabelData = (findParentLabel.id !== newRelease.labelID) ? findParentLabel : undefined
            let lastParentStatus = (lastParentLabelData) ? lastParentLabelData.status : undefined

            /// Save Last Parent if Exist
            if (lastParentLabelData) {
              await this.addParentLabelToRelease(newRelease, lastParentLabelData)
            }

            /// Add release to Label
            await this.addReleaseToLabel(newRelease, firstLabelData, lastParentLabelData)

            //// add statusDiscogs
            let discogsStatus = (lastParentStatus) ? lastParentStatus : firstLabelStatus
            let data = { prop: 'statusDiscogs', value: firstLabelStatus }
            await this.releaseEditOneProp(newRelease.releaseID, data)

          }
          /// Get Artist Data
          if (newRelease.artists.length) {
            await this.getAndSaveNewArtist(newRelease)
          }
          return { success: true, message: `All Data Saved!` }
        } else {
          return { success: false, msg: 'Someting Wrong with Saving' };
        }
      } else {

        if (findRelease.type === 'preorder') {
          /// need to change type to 'coming_soon'
          let data = { prop: 'type', value: 'coming_soon' }
          await this.releaseEditOneProp(newRelease.releaseID, data)
          return { success: true, msg: 'This release already exist. Type was changed to coming_soon' };
        } else if (findRelease.type === 'allowed_to_buy') {
          /// need to change type to 'goods'
          let data = { prop: 'type', value: 'goods' }
          await this.releaseEditOneProp(newRelease.releaseID, data)
          return { success: true, msg: 'This release already exist. Type was changed to goods' };
        } else {
          return { success: false, msg: 'This release already exist' };
        }
        
      }

    } catch (error) {
      console.log('catch error ', error)
      //throw ApiError.BadRequest(`Something wrong`)
      return { success: false, error };
    }
  }

  //// Получить дополнительные данные по релизу
  async getAdditionalDataOfRelease(release) {
    const releaseData = await discogsService.getReleaseData(release.releaseID)
    console.log('release.source ', release.source)
    return {
      releaseID: release.releaseID,
      type: release.type ? release.type : 'goods',
      source: release.source ? release.source : '',
      sourceCondition: release.sourceCondition ? release.sourceCondition : '',
      quality: release.quality ? release.quality : '',
      title: releaseData.title ? releaseData.title : '',
      artist: releaseData.artists_sort ? releaseData.artists_sort : '',
      labelID: releaseData.labels !== undefined ? releaseData.labels[0].id : '',
      labelName: releaseData.labels !== undefined ? releaseData.labels[0].name : '',
      labelLink: releaseData.labelLink ? releaseData.labelLink : '',
      updated: releaseData.updated ? releaseData.updated : Date.parse(new Date()),
      notes: [],
      status: 'default',
      statusArtist: 'default',
      statusYoutube: 'notUploaded',
      statusVarious: releaseData.artists_sort.indexOf('Various') > -1 ? 'various' : '',
      statusMain: 'allowed',
      onRevibed: {
        forSale: false,
        id: ''
      },
      artists: releaseData.artists ? releaseData.artists : [],
      year: releaseData.year ? releaseData.year : 0,
      country: releaseData.country ? releaseData.country : '',
      genres: releaseData.genres ? releaseData.genres : [],
      styles: releaseData.styles ? releaseData.styles : []
      
    }
  }

  /// По лейбл ID получает с Дискогса всю цепочку лейблов, сохраняет их в базе если их нет.
  /// Возвращает { firstLabeLID, parentLabelID }
  async getAndSaveNewLabelsFromDiscogs(labelID) {
    /// get all labels chain
    const labelsNew = await this.getLabelsChainFromDiscogs(labelID, [])
    console.log('labelsNew ', labelsNew)
    if (labelsNew.length) {
      for (let label of labelsNew) {
        let findLabel = await Labels.findOne({ id: label.id });
        if (!findLabel) {
          const newLabelData = new Labels(label)
          let saveLabel = await newLabelData.save()
          console.log('saveLabel ', saveLabel)
        }
      }
      let firstLabeLID = labelID
      let lastParentLabelID = (labelsNew.length > 1) ? labelsNew[labelsNew.length - 1].id : undefined
      return {
        firstLabeLID: firstLabeLID,
        lastParentLabelID: lastParentLabelID
      }
    }
  }

  async getLabelsChainFromDiscogs(id, labels) {
    try {
      const data = await discogsService.getLabelData(id);
      console.log('getLabelData ', data.name)
      /// check
      let checkIfExist = labels.find(item => item.id === data.id)
      if (checkIfExist) {
        return labels
      } else {
        labels.push(data)
        if (data.parent_label) {
          return await this.getLabelsChainFromDiscogs(data.parent_label.id, labels)
        } else {
          console.log('Thats all!', labels.length)
          return labels;
        }
      }

    } catch (err) {
      console.log("error getReleaseData", err, id);
      return false
    }
  }

  async getLastParentLabel(labelID) {
    let findLabel = await Labels.findOne({ id: labelID });
    // console.log('findParent ', findLabel.name)
    if (findLabel) {
      if (findLabel.parent_label) {
        console.log('new search', findLabel.parent_label.id)
        return this.getLastParentLabel(findLabel.parent_label.id)
      } else {
        console.log('exit ', findLabel.id)
        return findLabel
      }
    } else {
      return findLabel
    }
  }

  async addParentLabelToRelease(newRelease, lastParentLabel) {
    console.log('addParentLabelToRelease ', lastParentLabel)
    const releaseOne = await Releases.findOne({ releaseID: newRelease.releaseID });
    releaseOne.labelParent = (lastParentLabel) ? lastParentLabel : undefined
    releaseOne.labelParentID = (lastParentLabel) ? lastParentLabel.id : undefined
    let saveItem = await releaseOne.save()
    console.log('saveItem ', saveItem)
  }

  /// Добавить Артистов в базу по Релизу у которого уже есть release.artists
  async getAndSaveNewArtist(release) {
    console.log('release.artists ', release.artists)
    if (!release.artists.length) return;
    for (let artist of release.artists) {
      let artistData = await Artists.findOne({ id: artist.id });
      if (!artistData) {
        let newArtist = {
          id: artist.id,
          name: artist.name,
          releases: [release.releaseID]
        }
        const newArtistData = new Artists(newArtist)
        let saveData = await newArtistData.save()
        console.log('saveData ', saveData)
      } else {
        let findRelease = artistData.releases.indexOf(release.releaseID)
        if (findRelease === -1) {
          artistData.releases.push(release.releaseID)
          await artistData.save()

          //// statusArtist
          let artistStatus = artistData.status ? artistData.status : 'default'
          let data = { prop: 'statusArtist', value: artistStatus }
          await this.releaseEditOneProp(release.releaseID, data)
        }
      }
    }
    return true;
  }

  async addReleaseToLabel(newRelease, firstLabel, lastParentLabel) {
    //console.log('addReleaseToLabel ', newRelease, firstLabel, lastParentLabel)
    try {
      if (firstLabel) {
        if (firstLabel.releases.indexOf(newRelease.releaseID) === -1) {
          firstLabel.releases.push(newRelease.releaseID)
          let firstLabelSave = await firstLabel.save()
          //console.log('firstLabelSave ', firstLabelSave)
        }
      }
      if (lastParentLabel) {
        if (lastParentLabel.subreleases.indexOf(newRelease.releaseID) === -1) {
          lastParentLabel.subreleases.push(newRelease.releaseID)
          let parentLabelSave = await lastParentLabel.save()
          //console.log('parentLabelSave ', parentLabelSave)
        }
      }

    } catch (e) {
      console.log(e)
    }
  }

  /// Add Releases To Labels
  async releasesToLabels(labelID, parentLabelID) {
    //console.log('releasesToLabels', labelID, parentLabelID)
    try {
      let releases = []
      let releases1 = await Releases.find({ $or: [{ labelParentID: labelID }, { labelID: labelID }] }).sort({ _id: -1 });
      if (parentLabelID) {
        let releases2 = await Releases.find({ $or: [{ labelParentID: parentLabelID }, { labelID: parentLabelID }] }).sort({ _id: -1 });
        releases = releases1.concat(releases2)
      } else {
        releases = [].concat(releases1)
      }
      console.log('releases ', releases)
      const labels = await Labels.find({}).sort({ _id: -1 });

      let sortedLabels = []

      function getParentLabel(labelID) {
        let label = labels.find(item => item.id === labelID)
        if (!label) return label
        if (label.parent_label) {
          return getParentLabel(label.parent_label.id)
        } else {
          return label
        }
      }

      for (let release of releases) {
        // if (release.youtubeCopyrightOwners.length) {
        //   await distributorsService.checkCopyrightOwners(release, release.youtubeCopyrightOwners)
        // }
        let label = labels.find(item => item.id === release.labelID)
        if (label) {
          let parentLabel = getParentLabel(release.labelID)
          if (parentLabel) {
            if (parentLabel.id !== label.id) {
              release.labelParentID = parentLabel.id
              release.labelParentName = parentLabel.name
              release.labelParent = parentLabel
              let findIndexParent = sortedLabels.findIndex(item => item.id === parentLabel.id)
              if (findIndexParent < 0) {
                parentLabel.subreleases = []
                parentLabel.subreleases.push(release.releaseID)
                sortedLabels.push(parentLabel)
              } else {
                let index = parentLabel.subreleases.indexOf(release.releaseID)
                if (index < 0) {
                  sortedLabels[findIndexParent].count += 1
                  parentLabel.subreleases.push(release.releaseID)
                }
              }

            } else {
              release.labelParentID = null
              release.labelParentName = undefined
              release.labelParent = undefined
            }
          } else {
            release.labelParentID = null
            release.labelParentName = undefined
            release.labelParent = undefined
          }

          let findIndex = sortedLabels.findIndex(item => item.id === label.id)
          if (findIndex < 0) {
            label.count = 1
            label.releases = []
            label.releases.push(release.releaseID)
            sortedLabels.push(label)
          } else {
            let index = label.releases.indexOf(release.releaseID)
            if (index < 0) {
              sortedLabels[findIndex].count += 1
              label.releases.push(release.releaseID)
            }
          }
        } else {
          console.log('label not found', release.labelID)
        }

        let saveItem = await release.save()
        if (!saveItem) {
          console.log(err)
        } else {
          console.log('saveItem')
        }

      }

      //console.log('sortedLabels ', sortedLabels)

      if (!releases) {
        return false
      }
      // console.timeEnd('getReleases')

      for (let label of sortedLabels) {
        try {
          const labelOne = await Labels.findById(label._id);
          // console.log('labelOne ', labelOne)

          if (!labelOne) {
            return false
          } else {
            if (label.releases) {
              labelOne.releases = []
              labelOne.releases = label.releases
            }
            if (label.subreleases) {
              labelOne.subreleases = []
              labelOne.subreleases = label.subreleases
            }
            // console.log('labelOne2 ', labelOne)
            let saveItem = await labelOne.save()
            if (!saveItem) {
              console.log(err)
            } else {
              //console.log(`label with ID_${saveItem._id} saved!`)
            }
          }

        } catch (e) {
          console.log(e)
          return false
        }
      }

      return true;
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async removedReleaseFromLabel(releaseID, firstLabeLID, parentLabelID) {
    console.log('removedReleaseFromLabel ', releaseID, firstLabeLID, parentLabelID)
    try {
      if (firstLabeLID) {
        let firstLabel = await Labels.findOne({ id: firstLabeLID });
        if (firstLabel) {
          let index = firstLabel.releases.indexOf(releaseID)
          if (index > -1) {
            firstLabel.releases.splice(index, 1);
            let firstLabelSave = await firstLabel.save()
            //console.log('firstLabelSave ', firstLabelSave)
          }

        }
      }

      if (parentLabelID) {
        let parentLabel = await Labels.findOne({ id: parentLabelID });
        if (parentLabel) {
          let index = parentLabel.subreleases.indexOf(releaseID)
          if (index > -1) {
            parentLabel.subreleases.splice(index, 1);
            let parentLabelSave = await parentLabel.save()
            //console.log('parentLabelSave ', parentLabelSave)
          }

        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  /// Get Releases 
  async getAll() {

    // await revibedService.bindWithRevibedGoods()

    try {
      // const releases = await Releases.find({type: 'goods'}).sort({ _id: -1 });
      // if (!releases) {
      //   return { message: `Ничего не найдено` }
      // }
      // const releasesExtended = await this.releasesHandle(releases)
      // const notGoods = await Releases.find({type: {$ne: 'goods'}}).sort({ _id: -1 });

      const releases = await Releases.find({"type": { "$in": ["goods", "coming_soon"]}}).sort({ _id: -1 });
      if (!releases) {
        return { message: `Ничего не найдено` }
      }
      const releasesExtended = await this.releasesHandle(releases)
      const notGoods = await Releases.find({"type": { "$in": ["preorder", "allowed_to_buy"]}}).sort({ _id: -1 });

      return {
        success: true,
        releases: releasesExtended.releases,
        countries: releasesExtended.countries,
        onRevibedCount: releasesExtended.onRevibedCount,
        onYoutubeCount: releasesExtended.onYoutubeCount,
        labels: releasesExtended.labels,
        artists: releasesExtended.artists,
        notGoods: notGoods
      };
    } catch (e) {
      console.log(e)
      return { success: false, message: "Access Error" };
    }
  }

  async releasesHandle(releases) {
    //console.time("releasesHandle ", releases[0]);
    let onRevibedCount = 0
    let onYoutubeCount = 0
    let onRevibed = []

    // let labelsAll = await Labels.find({}).sort({ _id: -1 });
    // let labels = labelsAll.map (item => {
    //   item.count = item.releases.length + item.subreleases.length;
    //   return item
    // }) 
    // let artists = await Artists.find({}).sort({ _id: -1 });
    //let countries = await Countries.find({}).sort({ _id: -1 });

    // console.log('labels ', labels.length)
    // console.log('artists ', artists.length)
    let releasesCount = releases.length

    for (let i = 0; i < releasesCount; ++i) {
      let release = releases[i]

      if (release.youtubeCopyrightOwners.length) {
        release.youtubeCopyrightOwnersString = {
          distributor: '',
          label: ''
        }
        let youtubeCopyrightOwnersDistributorArr = []
        let youtubeCopyrightOwnersLabelArr = []
        for (let row of release.youtubeCopyrightOwners) {
          if (row.distributor.length) {
            for (let item of row.distributor) {
              youtubeCopyrightOwnersDistributorArr.push(item)
            }
          }
          if (row.label.length) {
            for (let item of row.label) {
              youtubeCopyrightOwnersLabelArr.push(item)
            }
          }
        }
        release.youtubeCopyrightOwnersString.distributor = youtubeCopyrightOwnersDistributorArr.join(', ')
        release.youtubeCopyrightOwnersString.label = youtubeCopyrightOwnersLabelArr.join(', ')
      }
      if (release.onRevibed.forSale) {
        onRevibedCount += 1
        //onRevibed.push(release)
      }
      if (release.youtubeVideoID) {
        onYoutubeCount += 1
      }
      if (!release.comment) {
        release.comment = ''
      }
    }
    //console.timeEnd("releasesHandle");

    //await this.editReleasesMany(releases)
    // await editLabelsMany(labels)
    //console.log('onRevibed ', onRevibed)

    // try {
    //   fs.writeFileSync('./check/onRevibed.json', JSON.stringify(onRevibed) , 'utf-8');
    // } catch (error) {
    //   console.log(error.message)
    // }

    let finalData = {
      releases: releases,
      // countries: countries,
      // labels: labels,
      // artists: artists,
      onRevibedCount: onRevibedCount,
      onYoutubeCount: onYoutubeCount
    }
    return finalData
  }

  async editReleasesMany (releases) {
    for (let releaseNew of releases) {
      const releaseFromDB = await Releases.findById(releaseNew._id);
      if (!releaseFromDB) {
        return res.status(400).json({ message: `Ничего не найдено` })
      } else {  
        releaseFromDB.statusMain = await this.releaseSaleStatusHandler(releaseFromDB)
        let saveItem = await releaseFromDB.save()
        console.log('saveItem ', saveItem)
      }
    }
  }

  //updateByRevibedID
  async updateByRevibedID(releases) {
    for (let releaseNew of releases) {
      const id = releaseNew.id
      const releaseFromDB = await Releases.find({"onRevibed.id": id});
      if (releaseFromDB) {
        console.log('releaseFromDB ', releaseFromDB.onRevibed)
        releaseFromDB.authors = releaseNew.authors
        releaseFromDB.composers = releaseNew.composers
        await releaseFromDB.save()
      } 
    }
  }

  /// Edit Release 
  async update(id, release, user) {
    console.log('editRelease ', id)
    let releaseNew = release;
    let firstLabelData;
    let labelChanged = false;
    //console.log('releaseNew ', releaseNew)
    try {
      const releaseFromDB = await Releases.findById(id);
      // console.log('labelOne ', labelOne)

      if (!releaseFromDB) {
        return res.status(400).json({ message: `Ничего не найдено` })
      } else {
        if (releaseNew.name) {
          releaseFromDB.name = releaseNew.name
        }
        if (releaseNew.status) {
          releaseFromDB.status = releaseNew.status
          if (releaseFromDB.status === 'blocked') {
            //emitter.emit('eventRemove', releaseFromDB);
          }
        }
        if (releaseNew.notes) {
          releaseFromDB.notes = releaseNew.notes
        }
        if (releaseNew.source) {
          releaseFromDB.source = releaseNew.source
        }
        if (releaseNew.type) {
          releaseFromDB.type = releaseNew.type
        }
        if (releaseNew.youtubeVideoID) {

          if (releaseNew.youtubeCopyrightOwners && releaseNew.youtubeCopyrightOwners.length) {
            distributorsService.checkCopyrightOwners(releaseNew.youtubeCopyrightOwners)
            releaseFromDB.youtubeCopyrightOwners = releaseNew.youtubeCopyrightOwners
            releaseFromDB.statusYoutube = 'warning'
          } else {
            releaseFromDB.youtubeCopyrightOwners = []
            releaseFromDB.statusYoutube = 'review'
          }
        }

        if (releaseNew.statusDiscogs) {
          releaseFromDB.statusDiscogs = releaseNew.statusDiscogs
        }
        if (releaseNew.statusArtist) {
          releaseFromDB.statusArtist = releaseNew.statusArtist
        }

        /// если изменили родной лейбл
        if (releaseFromDB.labelID !== releaseNew.labelID) {
          await this.removedReleaseFromLabel(releaseNew.releaseID, releaseFromDB.labelID, releaseFromDB.labelParentID)
          /// change parentLabel
          firstLabelData = await Labels.findOne({ id: releaseNew.labelID });
          console.log('firstLabelData ', firstLabelData)
          if (firstLabelData) {
            let labelParent = firstLabelData.main_parent_label
            if (labelParent) {
              releaseFromDB.labelParentID = labelParent.id
            } else {
              releaseFromDB.labelParentID = null
            }

          }
          releaseFromDB.labelID = releaseNew.labelID
          releaseFromDB.labelName = releaseNew.labelName
          labelChanged = true

        }

        if (releaseNew.sourceCondition) {
          releaseFromDB.sourceCondition = releaseNew.sourceCondition
        }

        if (releaseNew.quality) {
          releaseFromDB.quality = releaseNew.quality
        }

        //// statusMain
        let statusMainOld = releaseFromDB.statusMain
        releaseFromDB.statusMain = await this.releaseSaleStatusHandler(releaseFromDB)

        releaseFromDB.lastUpdate = {
          user: user,
          date: Date.parse(new Date())
        }

        let saveItem = await releaseFromDB.save()

        /// After save

        if (labelChanged) {
          console.log('labelChanged ', releaseNew)
          let firstLabelStatus = (firstLabelData) ? firstLabelData.status : undefined

          /// Get Last Parent
          let findParentLabel = await this.getLastParentLabel(releaseNew.labelID)
          console.log('findParentLabel ', findParentLabel)
          let lastParentLabelData = (findParentLabel.id !== releaseNew.labelID) ? findParentLabel : undefined
          let lastParentStatus = (lastParentLabelData) ? lastParentLabelData.status : undefined
          console.log('lastParentLabelData ', lastParentLabelData)

          /// Save Last Parent if Exist
          await this.addParentLabelToRelease(releaseNew, lastParentLabelData)

          /// Add release to Label
          await this.addReleaseToLabel(releaseNew, firstLabelData, lastParentLabelData)

          //// add statusDiscogs
          let discogsStatus = (lastParentStatus) ? lastParentStatus : firstLabelStatus
          let data = { prop: 'statusDiscogs', value: discogsStatus }
          await this.releaseEditOneProp(releaseNew.releaseID, data)
        }

        /// if main status has been changed
        if (statusMainOld !== releaseFromDB.statusMain) {
          const rvChecker = await revibedService.checker(releaseFromDB)
          console.log('rvChecker ', rvChecker)
        }
        
        if (!saveItem) {
          console.log(err)
          return {
            success: false,
            message: `Release not saved!`
          }
        } else {
          /// user log
          if (user) {
            userService.addLog({
              username: user,
              log: {
                section: 'releases',
                pageID: saveItem._id,
                date: Date.parse(new Date())
              }
            })
          }
          return {
            success: true,
            message: `Release with ID_${saveItem._id} saved!`,
          }
        }
      }

    } catch (e) {
      console.log(e)
      return { success: false, message: "Access Error" };
    }
  }

  async releaseEditOneProp(releaseID, data) {
    try {
      console.log('releaseEditOneProp inside', releaseID, data)
      const releaseFromDB = await Releases.findOne({ releaseID: releaseID });
      if (!releaseFromDB) {
        return { success: false, message: `Ничего не найдено` }
      } else {
        releaseFromDB[data.prop] = data.value
        if (data.prop === 'youtubeVideoID') {
          releaseFromDB.statusYoutube = 'review'
        }
        let statusMainOld = releaseFromDB.statusMain
        releaseFromDB.statusMain = await this.releaseSaleStatusHandler(releaseFromDB)
        await releaseFromDB.save()
        // console.log('saveItem ', saveItem)

        /// if main status has been changed
        if (statusMainOld !== releaseFromDB.statusMain) {
          const rvChecker = await revibedService.checker(releaseFromDB)
          console.log('rvChecker ', rvChecker)
        }

        return { success: true, message: `Done!` }
      }
    } catch (error) {
      console.log('releaseEditOneProp error ', error)
      return false
    }

  }

  async releaseUpdateOnePropMultiple(releaseIDs, data) {

    try {

      let releasesUpdated = []
      for (let releaseID of releaseIDs) {
        let releaseFromDB = await Releases.findOne({ releaseID: releaseID });
        if (!releaseFromDB) {
          return { success: false, message: `Ничего не найдено` }
        } else {
          releaseFromDB[data.prop] = data.value
          if (data.prop === 'youtubeVideoID') {
            releaseFromDB.statusYoutube = 'review'
          }
          let statusMainOld = releaseFromDB.statusMain
          releaseFromDB.statusMain = await this.releaseSaleStatusHandler(releaseFromDB)
          await releaseFromDB.save()
  
          /// if main status has been changed
          if (statusMainOld !== releaseFromDB.statusMain) {
            releasesUpdated.push(releaseFromDB)
          }
        }    
      }

      console.log('releasesUpdated ', releasesUpdated)

      if (releasesUpdated.length) {
        const rvChecker = await revibedService.checkerMultiple(releasesUpdated)
        console.log('rvChecker ', rvChecker)
      }


    } catch (error) {
      console.log('releaseUpdateOnePropMultiple error ', error)
      return false
    }

  }

  releaseSaleStatusHandler(release) {
    if (release.status === 'success') {
      return 'allowed'
    } else {
      if (release.statusDiscogs === 'success') {
        if (release.status === 'blocked') {
          return 'blocked'
        } else {
          return 'allowed'
        }
      } else {
        const checker = {
          status: release.status ? release.status : 'default',
          statusYoutube: release.statusYoutube ? release.statusYoutube : 'default',
          statusDiscogs: release.statusDiscogs ? release.statusDiscogs : 'default',
          statusArtist: release.statusArtist ? release.statusArtist : 'default',
          statusDistributor: release.statusDistributor ? release.statusDistributor : 'default',
          statusOwner: release.statusOwner ? release.statusOwner : 'default',
          statusVarious: release.statusVarious ? release.statusVarious : '',
        }
        const result = Object.values(checker).some(item => item === 'warning' || item === 'blocked' || item === 'various' || item === 'notUploaded')
        console.log('result ', result)
        if (result) {
          return 'blocked'
        } else {
          return 'allowed'
        }
      }
    }

  }

  async putOnSale(data) {
    const release = data.release;
    console.log('putOnSale release ', release)

    const rvChecker = await revibedService.checker(release)
    console.log('rvChecker ', rvChecker)

    return {
      success: true,
      message: `putOnSale Done!`
    }
  }

  /// Delete Release
  async delete(id) {
    let release_id = id;
    let release = await Releases.findById(release_id);
    let releaseID = release.releaseID
    console.log('release ', release)
    console.log('releaseID ', releaseID)
    let deleteItem = await Releases.deleteOne({ _id: release_id });
    console.log('deleteItem ', deleteItem)
    if (deleteItem.deletedCount) {
      return {
        success: true,
        message: `deleteRelease Done!`
      }
    } else {
      return false
    }
    await this.removedReleaseFromLabel(releaseID, release.labelID, release.labelParentID)
  }

  /// Export CSV
  async export (data) {
    const ids = data.releases;
    console.log('ids ', ids)
    let releases = await Releases.find().where('_id').in(ids).sort({ _id: -1 })
    console.log('releases ', releases)

    releases = releases.map(item => {
      return {
        title: item.title,
        artist: item.artist,
        releaseID: item.releaseID,
        source: item.source,
        onRevibed: item.onRevibed
      }
    })
    return releases
  }

  async checkRelease (releaseID) {
    console.log('checkRelease ', releaseID)
    const releaseFromDB = await Releases.findOne({ releaseID: releaseID });
    console.log('releaseFromDB ', releaseFromDB)
    if (releaseFromDB) {
      return {
        result: 'release exist',
        data: {
          status: releaseFromDB.statusMain
        }
        
      }
    } else {
      const releaseDiscogsData = await discogsService.getReleaseData(releaseID)
      if (releaseDiscogsData) {
        console.log('releaseDiscogsData ', releaseDiscogsData.labels)
        const labelID = releaseDiscogsData.labels[0].id
        await this.getAndSaveNewLabelsFromDiscogs(labelID)

        /// Get Label Data 
        let firstLabelData = await Labels.findOne({ id: labelID });
        let firstLabelName = (firstLabelData) ? firstLabelData.name : undefined
        let firstLabelStatus = (firstLabelData) ? firstLabelData.status : undefined

        /// Get Last Parent
        let findParentLabel = await this.getLastParentLabel(labelID)
        let lastParentLabelData = (findParentLabel.id !== labelID) ? findParentLabel : undefined
        let lastParentLabelName = (lastParentLabelData) ? lastParentLabelData.name : undefined
        let lastParentStatus = (lastParentLabelData) ? lastParentLabelData.status : undefined

        console.log('firstLabelData ', firstLabelData)
        console.log('lastParentLabelData ', lastParentLabelData)
        
        return {
          result: 'release not exist',
          data: {
            firstLabel: firstLabelName, 
            firstLabelStatus: firstLabelStatus, 
            lastParentLabel: lastParentLabelName,
            lastParentStatus: lastParentStatus 
          }
          }
      }
      
    }
  }

}


////////////// 

module.exports = new ReleaseService();
