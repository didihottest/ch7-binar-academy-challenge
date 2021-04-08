// use express module
const cors = require('cors');
const express = require('express');
const app = express();
const routers = express.Router();
const User_Game = require('./../db/user_game.js')
const { User_Game_BiodataSchema, User_Game_Biodata } = require('./../db/user_game_biodata')
const { User_Game_HistorySchema, User_Game_History } = require('./../db/user_game_history')
// to pass form data from body
const multer = require('multer')
// use connection module to connect to database from route
require('./../db/connection')
// Get request raw json from postman / api
app.use(express.json());
// Get request form form-urlencoded form postman / api
app.use(express.urlencoded({ extended: true }));

routers.post("/newuser", multer().none(), async (req, res) => {
  try {
    const { username, password, firstName, lastName, age, win, lose } = req.body;
    const user_biodata = {
      firstName: firstName,
      lastName: lastName,
      age: age
    }
    const newUser_biodata = new User_Game_Biodata(user_biodata)
    await newUser_biodata.save()
    const user_history = {
      win: win,
      lose: lose
    }
    const newUser_history = new User_Game_History(user_history)
    await newUser_history.save()

    const user = {
      username: username,
      password: password,
      userGameBiodata: newUser_biodata,
      userGameHistory: newUser_history
    }
    const newUser = new User_Game(user)
    const doc = await newUser.save()
    if (newUser) {
      res.send({
        status: "Successfuly added",
        data: doc
      })
    } else {
      res.send({
        status: 'Fail to add new data',
      })
    }
  } catch (error) {
      res.send(error.message)
  }

})

module.exports = routers