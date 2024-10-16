const jwt = require("jsonwebtoken");
const { jwtToken } = require("../config/config");
const apiKeyGood = 'l74b9ba9qmext9a6ulniigq8'
const checkToken = (query) => {
  const token = query.token
  if (token) {
    console.log('token exist: ', token)
    try {
      const decoded = jwt.verify(token, jwtToken);
      console.log('decoded ', decoded)
      if (!decoded) {
        return false
      }
      return true
    } catch (error) {
      console.log('token error', error.message)
      return false
    }
  } else {
    return false
  }
}
const checkApiKey = (headers) => {
  const apiKey = headers['x-api-key']
  if (apiKey && apiKey === apiKeyGood) {
    return true
  } else {
    return false
  }
}
module.exports = function (req, res, next) {
    console.log('auth midd ', req.originalUrl)
    if (req.originalUrl === '/auth/login') {
      next()
    } else {
      const hasToken = checkToken(req.query)
      console.log('hasToken ', hasToken)
      const hasApiKey = checkApiKey(req.headers)
  
      if (hasToken || hasApiKey) {
        console.log('Access allowed!')
        next()
      } else {
        return res.status(400).json({ message: "Access denied" });
      }
    }

   
}
