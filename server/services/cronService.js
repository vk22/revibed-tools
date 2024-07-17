
const cron = require('node-cron');
const revibedService = require("./revibedService");

class CronService {
  constructor() {
    this.bindWithRevibedGoodsTask = undefined
  }

  async startTask() {
    console.log('startTask')
    // this.stopTask()
    this.bindWithRevibedGoodsTask = cron.schedule('0 * * * *', async () => {
      console.log('running a task every 1 hour');
      const response = await revibedService.bindWithRevibedGoods()
      // console.log('parse ', parse)
    });
  }

  async stopTask() {
    console.log('stopTask')
    if (this.bindWithRevibedGoodsTask) {
      this.bindWithRevibedGoodsTask.stop();
      return
    }
  }
}


module.exports = new CronService();
