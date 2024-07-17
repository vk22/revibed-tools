const Labels = require("../models/labels-model");
const Releases = require("../models/releases-model");
const ObjectsToCsv = require('objects-to-csv');
const exportFolder = '/var/www/labels/www/server/export/'
const userService = require("./userService");
const releaseService = require("./releaseService");


const generateID = () => {
  return Math.floor(Math.random() * 1000000000)
}

class ReleaseService {
/// Add Label
async create(data) {  
  try {
    console.log(' LabelService create ', data)
    let label = data.label;
    label.id = generateID()
    console.log('label ', label)
    const newLabelData = new Labels(label)
    let saveLabel = await newLabelData.save()
    console.log('saveLabel ', saveLabel)

    if (saveLabel) {
      return {
        success: true,
        message: `addLabel Done!`
      }
    } else {
      return {
        success: false,
        message: `Smth wrong`
      }
    }
  } catch (error) {
    console.log('error ', error)
  }

}

/// Get Labels 
async getAll() {
  console.log('getLabels')
  try {
    let labelsAll = await Labels.find({}).sort({ _id: -1 });
    let labels = labelsAll.map (item => {
      //this.update(item._id, item, null)
      item.count = item.releases.length + item.subreleases.length;
      return item
    }) 
    return { success: true, labels: labels };
  } catch (e) {
    res.status(400).json({ success: false, message: "Access Error" });
  }
}


async getMainParentLabel (parentLabelID) {

  let findParent = await Labels.findOne({id: parentLabelID});
  console.log('findParent ', findParent.name)
    if (findParent) {
      if (findParent.parent_label) {
        console.log('new search', findParent.parent_label.id)
        return this.getMainParentLabel(findParent.parent_label.id)
      } else {
        console.log('exit ', findParent.id)
        return findParent
      }
    } else {
      return parentLabelID
    }    
}

async sublabelsStatusUpdate(parentLabelID) {
  let parentLabel = await Labels.findOne({id: parentLabelID});
  if (parentLabel.sublabels) {
    console.log('sub labels exists')
    if (parentLabel.sublabels.length) {
      for (let label of parentLabel.sublabels) {
        await this.editLabelStatusContact({
          sourceLabelID: parentLabel.id,
          targetLabelID: label.id, 
          status: parentLabel.status, 
          statusContact: parentLabel.statusContact
        })
      }
      return { success: true, message: 'sublabelsStatusUpdate Done' };
    }
  }
}

async sublabelsExistUpdate () {
  /// update sublabelsExist
  let labels = await Labels.find({}).sort({ _id: -1 });
  
  for (const label of labels) {
    
    // console.log('label ', label)
    let sublabelsExist = []
    for (const sublabel of label.sublabels) {
      let releases = await Releases.find({labelID: sublabel.id}).sort({ _id: -1 });
      if (releases.length) {
        if (sublabelsExist.findIndex(item => item.id === sublabel.id) === -1) {
          sublabelsExist.push(sublabel)
        }
      }
    }
    if (label.id === 271) {
      console.log('sublabelsExist ', sublabelsExist)
    }
    const itemFromDB = await Labels.findById(label._id);
    itemFromDB.sublabelsExist = [...new Set(sublabelsExist)];
    await itemFromDB.save()
  }

  return { success: true, message: 'sublabelsExistUpdate Done' };

}

/// Edit Label 
async update (id, label, user) {
console.log('editLabel ', id, label, user)
let newLabelData = label
let labelID = newLabelData.id
let newParentLabelID = (newLabelData.parent_label) ? newLabelData.parent_label.id : null
let oldParentLabelID, releases, labelDataForParent;
let releasesToLabelsNeed = false
let statusMainChanged = false
let statusContacthanged = false
  try {
    const itemFromDB = await Labels.findById(id);
    // console.log('itemFromDB ', itemFromDB)
    if (!itemFromDB) {
      return {success: false, message: `Ничего не найдено`}
    } else {
      if (newLabelData.name) {
        itemFromDB.name = newLabelData.name
      }
      if (newLabelData.status) {
        if (itemFromDB.status !== newLabelData.status) {
          itemFromDB.status = newLabelData.status
          statusMainChanged = true
        }
      }
      if (newLabelData.statusContact) {
        if (itemFromDB.statusContact !== newLabelData.statusContact) {
          itemFromDB.statusContact = newLabelData.statusContact
          statusContacthanged = true
        }
      }
      if (newLabelData.releases) {
        itemFromDB.releases = newLabelData.releases
        
      }
      if (newLabelData.subreleases) {
        itemFromDB.subreleases = newLabelData.subreleases
      }

      if (newLabelData.contacts) {
        itemFromDB.contacts = newLabelData.contacts
      }

      console.log('itemFromDB.parent_label ', itemFromDB.parent_label)
      console.log('newLabelData.parent_label ', newLabelData.parent_label)
      if (newLabelData.parent_label) {

        if (itemFromDB.parent_label) {

          oldParentLabelID = itemFromDB.parent_label.id
          releases = [...itemFromDB.releases];
          labelDataForParent = {
            id: itemFromDB.id,
            name: itemFromDB.name
          }

          //// if parent label changed
          if (itemFromDB.parent_label.id !== newLabelData.parent_label.id) {
            console.log('if parent label changed')
            const newParentLabel = await Labels.findOne({id: newLabelData.parent_label.id});
            itemFromDB.parent_label = newLabelData.parent_label
            itemFromDB.subreleases = []
            itemFromDB.releases = []
            releasesToLabelsNeed = true

            // await addLabelSubLabel(newParentLabelID, {id: labelID, name: labelName})
            // await removeLabelSubLabel(oldParentLabelID, {id: labelID, name: labelName})

            let data = {prop: 'statusDiscogs', value: newParentLabel.status}
            for (let releaseID of itemFromDB.releases) {
              await releaseService.releaseEditOneProp(releaseID, data)
            }

          }


        } else {

          oldParentLabelID = undefined
          releases = [...itemFromDB.releases];
          labelDataForParent = {
            id: itemFromDB.id,
            name: itemFromDB.name
          }

          const newParentLabel = await Labels.findOne({id: newLabelData.parent_label.id});
          itemFromDB.parent_label = newLabelData.parent_label
          itemFromDB.subreleases = []
          itemFromDB.releases = []
          releasesToLabelsNeed = true

          //await addLabelSubLabel(newParentLabelID, {id: labelID, name: labelName})

          let data = {prop: 'statusDiscogs', value: newParentLabel.status}
          for (let releaseID of itemFromDB.releases) {
            await releaseService.releaseEditOneProp(releaseID, data)
          }

        }  
      }

      itemFromDB.lastUpdate = {
        user: user,
        date: Date.parse(new Date())
      }

      // console.log('itemFromDB2 ', itemFromDB)
      let saveItem = await itemFromDB.save()
      console.log('saveItem ', saveItem.id)

      //// After Save

      if (statusContacthanged || statusMainChanged) {
        //// Push statuses to parent and sub releases
        // if (itemFromDB.parent_label) {
        //   console.log('parent label exist')
        //   await editLabelStatusContact({
        //     user: user, 
        //     sourceID: itemFromDB.id,
        //     labelID: itemFromDB.parent_label.id, 
        //     status: itemFromDB.status, 
        //     statusContact: itemFromDB.statusContact
        //   })
        // }
        if (itemFromDB.sublabels) {
          if (itemFromDB.sublabels.length) {
            for (let label of itemFromDB.sublabels) {
              await this.editLabelStatusContact({
                user: user, 
                sourceLabelID: itemFromDB.id,
                targetLabelID: label.id, 
                status: itemFromDB.status, 
                statusContact: itemFromDB.statusContact
              })
            }
          }
        }
      }

      if (statusMainChanged) {
        //// обновлем статусы у релизов
        let data = {prop: 'statusDiscogs', value: itemFromDB.status}
        let releaseIDs = itemFromDB.releases.concat(itemFromDB.subreleases)
        console.log('обновлем статусы у релизов releaseIDs ', releaseIDs)
        if (releaseIDs.length) {
          await releaseService.releaseUpdateOnePropMultiple(releaseIDs, data)
        }
        console.log('обновлем статусы у релизов ГОТОВО')
      }

      //// if parent label changed
      if (releasesToLabelsNeed) {
        console.log('releasesToLabelsNeed ', labelID, newParentLabelID)
        await releaseService.releasesToLabels(labelID, newParentLabelID)
        await this.editLabelsSubreleases(oldParentLabelID, newParentLabelID, releases, labelDataForParent)
      }

      
      if (!saveItem) {
        console.log(err)
       return {
          success: false,
          message: `label not saved!`
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
        console.log(`label with ID_${saveItem._id} saved!`)
        return {
          success: true,
          message: `label with ID_${saveItem._id} saved!`,
        }
      }
    }
  } catch (e) {
    console.log(e)
    return { success: false, message: "Access Error" };
  }
}


async editLabelStatusContact (data) {
  let collect = []
  console.log('editLabelData ', data)
  const user = data.user
  const targetLabelID = data.targetLabelID
  const sourceLabelID = data.sourceLabelID
  const status = data.status
  const statusContact = data.statusContact
 
    try {
      const itemFromDB = await Labels.findOne({ id: targetLabelID });
      // console.log('itemFromDB ', itemFromDB.name)
      if (!itemFromDB) {
        return false
      } else {

        itemFromDB.status = status
        itemFromDB.statusContact = statusContact
  
        if (user) {
          itemFromDB.lastUpdate = {
            user: user,
            date: Date.parse(new Date())
          }
        }

        
        const saveItem = await itemFromDB.save()
        console.log('saveItem ', saveItem.id)

        ///
        collect.push(targetLabelID)
        console.log('collect ', collect)

        //// After Save
        
        //// Push statuses to parent and sub releases
        // if (itemFromDB.parent_label) {
        //   if (collect.indexOf(itemFromDB.parent_label.id) === -1) {
        //     await editLabelStatusContact({
        //       user: user, 
        //       sourceLabelID: itemFromDB.id,
        //       targetLabelID: itemFromDB.parent_label.id, 
        //       status: itemFromDB.status, 
        //       statusContact: itemFromDB.statusContact
        //     })
        //   } else {
        //     console.log('parent label ALREADY changed')
        //   }
        // } else {
        //   console.log('no parent labels')
        // }

        if (itemFromDB.sublabels) {
          if (itemFromDB.sublabels.length) {
            for (let label of itemFromDB.sublabels) {
              if (collect.indexOf(label.id) === -1) {
                await this.editLabelStatusContact({
                  user: user, 
                  sourceLabelID: itemFromDB.id,
                  targetLabelID: label.id, 
                  status: itemFromDB.status, 
                  statusContact: itemFromDB.statusContact
                })
              } else {
                console.log('sub label ALREADY changed')
              }

            }
          }
        } else {
          console.log('no sub labels')
        }
   
        //// обновлем статусы у релизов
        let data = {prop: 'statusDiscogs', value: itemFromDB.status}
        for (let releaseID of itemFromDB.releases) {
          await releaseService.releaseEditOneProp(releaseID, data)
        }
        for (let releaseID of itemFromDB.subreleases) {
          await releaseService.releaseEditOneProp(releaseID, data)
        }
        
        if (!saveItem) {
          console.log(err)
          return {
            success: false,
            message: `label not saved!`
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
            message: `label with ID_${saveItem._id} saved!`
          }

        }
      }
    } catch (e) {
      console.log(e)
      // res.status(400).json({ message: "Access Error" });
      return {
        success: false,
        message: `Access Error`
      }
    }
}

async editLabelsSubreleases (oldParentLabelID, newParentLabelID, releases, labelDataForParent) {
  /// parentLabel, removedLabel
  console.log('editLabelsSubreleases ', oldParentLabelID, newParentLabelID, releases, labelDataForParent)
  let oldParentLabel = await Labels.findOne({id: oldParentLabelID})
  if (oldParentLabel) {
    oldParentLabel.subreleases = oldParentLabel.subreleases.filter(el => releases.indexOf(el) === -1)
    oldParentLabel.sublabels = oldParentLabel.sublabels.filter(el => el.id !== labelDataForParent.id)
    oldParentLabel.sublabelsExist = oldParentLabel.sublabelsExist.filter(el => el.id !== labelDataForParent.id)
    await oldParentLabel.save()
  }

  let newParentLabel = await Labels.findOne({id: newParentLabelID})
  if (newParentLabel) {
    newParentLabel.subreleases = newParentLabel.subreleases.filter(el => releases.indexOf(el) === -1)
    newParentLabel.subreleases = newParentLabel.subreleases.concat(releases)
    let index = newParentLabel.sublabels.findIndex(item => item.id === labelDataForParent.id)
    if (index === -1) {
      newParentLabel.sublabels.push(labelDataForParent)
    }
    let index2 = newParentLabel.sublabelsExist.findIndex(item => item.id === labelDataForParent.id)
    if (index2 === -1) {
      newParentLabel.sublabelsExist.push(labelDataForParent)
    }
    await newParentLabel.save()
  }
}

async addLabelSubLabel (parentLabelID, sublabel) {
  console.log('addLabelSubLabel ', parentLabelID, sublabel)
  let parentLabel = await Labels.findOne({id: parentLabelID})
  if (parentLabel) {
    if (sublabel) {
      parentLabel.sublabels.push(sublabel)
      parentLabel.sublabelsExist.push(sublabel)
      await parentLabel.save()
    }
    
  }
}

async removeLabelSubLabel (parentLabelID, sublabel) {
  console.log('removeLabelSubLabel ', parentLabelID, sublabel)
  let parentLabel = await Labels.findOne({id: parentLabelID})
  if (parentLabel) {
    let index = parentLabel.sublabels.findIndex(item => item.id === sublabel.id)
    if (index > -1) {
      parentLabel.sublabels.splice(index, 1);
    }
    let index2 = parentLabel.sublabelsExist.findIndex(item => item.id === sublabel.id)
    if (index2 > -1) {
      parentLabel.sublabelsExist.splice(index2, 1);
    }
    await parentLabel.save()
  }
}


/// Edit Label 
async removeParentLabel (req) {
  console.log('removeParentLabel ', req.params.id)
  let labelData = req.body.label
  let labelID = labelData.id
  let parentLabel = labelData.parent_label
  if (!parentLabel) return res.status(400).json({message: `No data`})
  let parentLabelID = parentLabel.id
  console.log('labelData ', labelData)
  console.log('parentLabel ', parentLabel)
    try {

      const labelParentOne = await Labels.findOneAndUpdate({id: parentLabelID}, {subreleases: []});
      console.log('labelParentOne ', labelParentOne)

      const itemFromDB = await Labels.findById(req.params.id);
      console.log('itemFromDB ', itemFromDB)
      if (!itemFromDB) {
        return {success: false, message: `Ничего не найдено`}
      } else {
        
        itemFromDB.parent_label = undefined
        let saveItem = await itemFromDB.save()

        ///
        await releaseService.releasesToLabels(labelID, parentLabelID)
        
        ///
        // await removeLabelSubLabel(parentLabelID, {id: labelData.id, name: labelData.name})
        let labelDataForParent = {
          id: itemFromDB.id,
          name: itemFromDB.name
        }
        await this.editLabelsSubreleases(parentLabelID, undefined, itemFromDB.releases, labelDataForParent)
  
        if (!saveItem) {
          console.log(err)
          return {
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
      return {success: false, message: `Access Error`}
    }
  }

/// Export CSV
async export (data){
  const ids = data.labels;
  console.log('ids ', ids)
  let labels = await Labels.find().where('id').in(ids).sort({ _id: -1 })
  console.log('labels ', labels)

  labels = labels.map (item => {
    return {
      name: item.name,
      uri: item.uri, 
      sublabels: item.sublabels
    }
  })
  return labels

}

}


module.exports = new ReleaseService()
