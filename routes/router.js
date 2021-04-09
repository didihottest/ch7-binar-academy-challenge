// use express module
const express = require('express');
const app = express();
const routers = express.Router();
const { User_Game, User_Game_Biodata, User_Game_History } = require('./../db/user_game.js')
// to pass form data from body
const multer = require('multer')
// use mongoose ODM 
const mongoose = require('mongoose');
// use connection module to connect to database from route
require('./../db/connection')
// Get request raw json from postman / api
app.use(express.json());
// Get request form form-urlencoded form postman / api
app.use(express.urlencoded({ extended: true }));


// get user_games api
routers.get('/api/userlists', async (req, res) => {
  try {
    await User_Game.find()
    .populate('userGameBiodata userGameHistory')
    .exec((err, user_game) => {
      if (err) return handleError(err);
      res.send(user_game)
    })
  } catch (error) {
    res.send({
      status: "Failed to get data",
      message: error.message
    })
  }
  
})

routers.post("/api/adduser", multer().none(), async (req, res) => {
  const { username, password, firstName, lastName, age, win, lose } = req.body;
  const user_biodataID = new mongoose.Types.ObjectId()
  const user_historyID = new mongoose.Types.ObjectId()
  try {
    const newUser = new User_Game({
      _id: new mongoose.Types.ObjectId(),
      username: username,
      password: password,
      userGameBiodata: user_biodataID,
      userGameHistory: user_historyID
    })

    const user_biodata = new User_Game_Biodata({
      _id: user_biodataID,
      user_id: newUser._id,
      firstName: firstName,
      lastName: lastName,
      age: age
    })


    const user_history = new User_Game_History({
      _id: user_historyID,
      user_id: newUser._id,
      win: win,
      lose: lose
    })

    newUser.save((err) => {
      if (err) {
        return handleError(err)
      }
    })

    user_biodata.save((err) => {
      if (err) {
        return handleError(err)
      }
    })

    user_history.save((err) => {
      if (err) return handleError(err)
    })

    if (newUser) {
      res.send({
        status: "Successfuly added",
        data: newUser
      })
    } else {
      res.send({
        status: 'Fail to add new data'
      })
    }
  } catch (error) {
    res.send({
      status: 'Fail to add new data',
      message : error.message
    })
  }

})

routers.delete('/api/deleteuser/:id', async (req, res) => {
  try {
    const id = req.params.id;
    User_Game.findOneAndDelete({ _id: id }, async (err, res) => {
      try {
        await User_Game_Biodata.deleteOne({ _id: res.userGameBiodata })
        await User_Game_History.deleteOne({ _id: res.userGameHistory })
        res.send({
          status: "Deleted",
          message: "Document Successfully Deleted"
        })
      } catch (error) {
        res.send({
          status: "failed to delete",
          message: error.message
        })
      }
    })
  } catch (error) {
    res.send({
      status: "failed to delete",
      message: error.message
    })
  }
})

module.exports = routers