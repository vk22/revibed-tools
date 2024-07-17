const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { jwtToken } = require("../config/config");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const Releases = require("../models/releases-model");
const Labels = require("../models/labels-model");
const Artists = require("../models/artists-model");

/// Login User  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post("/auth/login", async (req, res) => {
  try {
    // const resToken = getToken(req.headers)
    // if (!resToken) {
    //   return res.status(400).json({ message: "Ошибка авторизации" });
    // }
    const { username, password } = req.body;
    console.log("username ", username);
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const validPassword = bcrypt.compareSync(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ message: "Wrong password" });
    }
    const token = jwt.sign({ username }, jwtToken, {
      expiresIn: '86400000' // expires in 1 day
      //expiresIn: '60000' // expires in 1 minute
    });
    res.json({ success: true, token: token, username: req.body.username });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Access denied" });
  }
});

/// Get User ////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/auth/user", async (req, res) => {
  try {
    const token = req.query.token
    console.log('token ', token)
    const decoded = jwt.verify(token, jwtToken);
    console.log('decoded ', decoded)
    // const user = await User.find({});
    if (!decoded) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json({ success: true, user: decoded });
  } catch (err) {
    console.log(err.message);
    if (err.message === 'jwt expired') {
      res.json({ success: false, message: err.message });
    } else {
      res.status(400).json({ message: "Access denied" });
    }
    
  }
});

/// Get Users ////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/auth/users", async (req, res) => {
  try {
    const token = req.query.token
    //console.log('token ', token)
    const decoded = jwt.verify(token, jwtToken);
    // console.log('decoded ', decoded)
    if (decoded.username === 'admin') {
      let users = await User.find();
      users = users.map(item => {
        return {
          username: item.username,
          usergroup: item.usergroup,
          logs: item.logs
        }
      })
      //await handle(users)
      res.json({ success: true, users: users });
    } else {
      res.status(400).json({ message: "Access denied" });
    }

  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});


/// Create New User //////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/auth/register', async (req, res) => {

  if (req.body.username != undefined && !req.body.password != undefined) {

    console.log('register ',req.body)
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).json({ message: "User exist" });
    }
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      usergroup: req.body.usergroup
    });
    let output = await newUser.save()
    console.log(output);
  }  

})

getToken = function (headers) {
  console.log('headers ', headers)
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
