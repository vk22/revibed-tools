
const axios = require('axios');
const fs = require('fs-extra')
const tokenRvbd = process.env.RVBD_TOKEN
const Releases = require("../models/releases-model");
const LogsService = require("./logsService");

class RevibedService {
  constructor() {
    this.goodsAllBuffer = []
  }

  async getGoods(pageNum = 0) {
    if (pageNum === 0) {
      this.goodsAllBuffer = []
    }
    try {
      const { data } = await axios.get(`https://system-api.revibed.com/goods?size=250&page=${pageNum}`, { headers: { "Authorization": `Bearer ${tokenRvbd}` } });
      if (!data.success) return false

      const goodFromPage = data.data
      this.goodsAllBuffer = this.goodsAllBuffer.concat(goodFromPage)
      const totalPages = data.payload.page.totalPages
      const currentPage = data.payload.page.currentNumber
      const nextPage = currentPage + 1
      //console.log('goodFromPage ', goodFromPage.length)
      //console.log('goodsAll ', this.goodsAllBuffer.length)
      if (nextPage <= totalPages) {
        return await this.getGoods(nextPage)
      } else {
        /// filter only goods: purchaseAvailable = true
        //let goods = this.goodsAllBuffer.filter(item => item.purchaseAvailable)
        return this.goodsAllBuffer
      }
    } catch (err) {
      console.log("error getGoods", err);
      return false
    }
  }

  async checker(release) {
    console.log('rv checker ')

    // return true

    const { releaseID, statusMain } = release;
    console.log('statusMain ', statusMain)
    let result;

    const goods = await this.getGoods()
    if (!goods) return

    const rvGoodsItem = goods.find(item => item.release.discogsId == releaseID)
    console.log('rvGoodsItem ', rvGoodsItem)
    if (rvGoodsItem) {
      if (statusMain === 'blocked') {
        console.log('OFF sale')
        result = await this.removeFromSale(rvGoodsItem.id)
      } else if (statusMain === 'allowed') {
        console.log('ON sale')
        result = await this.addOnSale(rvGoodsItem.id)
      }

      //// bind with Revibed Goods
      await this.bindWithRevibedGoods()
    }
    console.log('result ', result)
    return result;
  }

  async checkerMultiple(releases) {
    console.log('rv checkerMultiple ', releases)
    // return true
    let results = [];

    const goods = await this.getGoods()
    if (!goods) return

    for (let release of releases) {
      let result;
      const { releaseID, statusMain } = release;
      console.log('statusMain ', statusMain)

      const rvGoodsItem = goods.find(item => item.release.discogsId == releaseID)
      console.log('rvGoodsItem ', rvGoodsItem)
      if (rvGoodsItem) {
        if (statusMain === 'blocked') {
          console.log('OFF sale')
          result = await this.removeFromSale(rvGoodsItem.id)
        } else if (statusMain === 'allowed') {
          console.log('ON sale')
          result = await this.addOnSale(rvGoodsItem.id)
        }
      }
      console.log('result ', result)
      results.push(result)
    }

    //// bind with Revibed Goods
    await this.bindWithRevibedGoods()

    return results


  }

  async removeFromSale(goodsId) {
    try {
      const response = await axios.put(`https://system-api.revibed.com/goods`, {
        "goodsId": goodsId,
        "published": false
      }, { 
        headers: { "Authorization": `Bearer ${tokenRvbd}` } 
      });
      return response.data;
    } catch (e) {
      console.log('err ', e)
    }
  }

  async addOnSale(goodsId) {
    try {
      const response = await axios.put(`https://system-api.revibed.com/goods`, {
        "goodsId": goodsId,
        "published": true
      }, { 
        headers: { "Authorization": `Bearer ${tokenRvbd}` } 
      });
      return response.data;
    } catch (e) {
      console.log('err ', e)
    }
  }

  async bindWithRevibedGoods() {
    console.log('bindWithRevibedGoods')

    const goods = await this.getGoods()
    if (!goods) {
      LogsService.logger.error('No goods. Smth wrong with API call.')
      return;
    };

    let errors = []
    let onSale = []
    let offSale = []
    
    //// Remove all
    // const removeAll = await Releases.updateMany({}, { onRevibed: { forSale: false, id: '' } });
    // console.log('removeAll ', removeAll)

    try {
      for (let good of goods) {
        let releaseID = good.release.discogsId
        let goodsID = good.id
        let published = good.published
        const releaseOne = await Releases.findOne({ releaseID: releaseID });

        // if (releaseID === 3597518) {
        //   console.log('3597518 ', 3597518)
        //   console.log('releaseOne ', releaseOne)
        //   console.log('onRevibed ', { forSale: published, id: goodsID })
        // }
        if (!releaseOne) {
          errors.push(good)
        } else {
          releaseOne.onRevibed = { forSale: published, id: goodsID }
          let saveItem = await releaseOne.save()
          // success.push(good)
          if (published) {
            onSale.push(good)
          } else {
            offSale.push(good)
          }
          if (!saveItem) {
            console.log(err)
            errors.push(good)
          }
        }
      }
      console.log('bindWithRevibedGoods DONE!')
      console.log('onSale:', onSale.length)
      console.log('offSale:', offSale.length)
      console.log('errors:', errors)
      const logMessage = `Goods updated. Total count: ${goods.length}. onSale: ${onSale.length}. offSale: ${offSale.length}. Errors: ${errors.length}`
      
      LogsService.logger.info(logMessage)
      // fs.writeFileSync('./check/onSale.json', JSON.stringify(onSale) , 'utf-8');
      return {
        success: true,
        message: `Released updated!`,
        errors: errors,
        errorsCount: errors.length,
        onSale: onSale.length,
        offSale: offSale.length
      }

    } catch (e) {
      console.log(e)
      LogsService.logger.error(e.message)
      return false
    }
  }

}


module.exports = new RevibedService();
