module.exports = {
  port: 3000,
  dbURL: process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://0.0.0.0:27017/revibed',
  dbOptions: { useUnifiedTopology: true, useNewUrlParser: true },
  jwtToken: '7383dj2948fk0',
}

