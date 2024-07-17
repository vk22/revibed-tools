const User = require("../models/user-model");

class UserService {
/// Add Log
async addLog (data) {
  /// data
  const username = data.username
  const newLog = data.log
  try {
    /// user
    const userDB = await User.findOne({username: username});
    if (!userDB) {
      return false
    } else {
      userDB.logs.push(newLog)
      await userDB.save()
    }
  } catch (error) {
    console.error(error.message)
  }

}

}


module.exports = new UserService();
