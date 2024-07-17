const jwt = require("jsonwebtoken");
const { jwtToken } = require("../config/config");
module.exports = function (req, res, next) {
    const token = req.query.token
    console.log('token ', token)
    if (token) {
      const decoded = jwt.verify(token, jwtToken);
      console.log('decoded ', decoded)
      // const user = await User.find({});
      if (!decoded) {
        return res.status(400).json({ message: "Access denied" });
      }
    }
    next()
}
