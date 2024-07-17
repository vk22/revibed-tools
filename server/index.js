require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const config = require("./config/config");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const authMiddleware = require("./middleware/auth-middleware.js")
const cronService = require("./services/cronService");

// App
const app = express();
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// 
app.use(helmet());
app.use(cookieParser());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyParser.json());
app.use(cors());

//app.use(checkHeaders)
app.use(authMiddleware)

// routes
app.use(require("./routes/routes"));
app.use(require("./routes/user"));

// Session
app.use(
  expressSession({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SEC || "gjs83Ghf82",
  })
);

// Connect to Mongoose
mongoose.connect(config.dbURL);
mongoose.connection
  .once("open", () => {
    console.log(`Mongoose - successful connection ...`);
  })
  .on("error", (error) => console.warn(error));

app.listen(process.env.API_PORT, () => {
    console.log(`App is listening at http://localhost:${process.env.API_PORT}`);
    (async () => {
      console.log('Start cronService')
      await cronService.startTask()
    })()
});



