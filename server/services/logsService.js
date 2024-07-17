
const fs = require('fs');
const Logs = require("../models/logs-model");

class LogService {
  constructor() {
    // this.logger = {
    //   info: (message) => this.logToFile(`[INFO] ${message}`),
    //   warn: (message) => this.logToFile(`[WARN] ${message}`),
    //   error: (message) => this.logToFile(`[ERROR] ${message}`),
    // };
    this.logger = {
      info: (message) => this.logToBD(`[INFO] ${message}`),
      warn: (message) => this.logToBD(`[WARN] ${message}`),
      error: (message) => this.logToBD(`[ERROR] ${message}`),
    };

  }

  logToFile(message) {
    const logStream = fs.createWriteStream('bindWithRevibedGoods.log', { flags: 'a' });
    const date = new Date().toJSON();
    logStream.write(`${date} / ${message}\n`);
    logStream.end();
  }
  async logToBD(message) {
    try {
      console.log(' LogsService create ', message)
      const date = new Date().toJSON();
      const newLog = {
        date: date,
        message: message
      }
      const newData = new Logs(newLog)
      let saveData = await newData.save()
      console.log('saveData ', saveData)

    } catch (error) {
      console.log('logToBD error ', error.message)
    }

  }

  async getAll() {
    try {
      const logs = await Logs.find().sort({ _id: -1 });
      return {
        success: true,
        logs: logs
      };
    } catch (e) {
      console.log(e)
      return { success: false, message: "Access Error" };
    }
  }
}


module.exports = new LogService();
