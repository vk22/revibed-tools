
const Releases = require("../models/releases-model");
const revibedService = require("./revibedService");

class ReleaseExtService {

  async bindWithRevibedGoods() {
    console.log('bindWithRevibedGoods')
    // if (!goods) {
    //   const goods = await revibedService.getGoods()
    //   console.log('goods ', goods.length)
    // }

    const goods = await revibedService.getGoods()
    if (!goods) return;

    let errors = []
    let success = []
    
    //// Remove all
    // const removeAll = await Releases.updateMany({}, { onRevibed: { forSale: false, id: '' } });
    // console.log('removeAll ', removeAll)

    try {
      for (let good of goods) {
        let releaseID = good.release.discogsId
        let goodsID = good.id
        let published = good.published
        const releaseOne = await Releases.findOne({ releaseID: releaseID });

        if (!releaseOne) {
          errors.push(good)
        } else {
          releaseOne.onRevibed = { forSale: published, id: goodsID }

          let saveItem = await releaseOne.save()
          success.push(good)
          if (!saveItem) {
            console.log(err)
            errors.push(good)
          }
        }
      }
      return {
        success: true,
        message: `Released updated!`,
        errors: errors,
        errorsCount: errors.length,
        success: success.length
      }

    } catch (e) {
      console.log(e)
      return false
    }
  }
}


////////////// 

module.exports = new ReleaseExtService();
