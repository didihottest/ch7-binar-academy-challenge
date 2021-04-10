const express = require('express');
const app = express();
const { User_Game, User_Game_Biodata, User_Game_History } = require('../db/user_game.js')
// to pass form data from body
const cors = require('cors');
// use connection module to connect to database from route
require('../db/connection')
// to pass form data from body
const multer = require('multer')
// use mongoose ODM 
const mongoose = require('mongoose');
// use cors moudule on express
app.use(cors())
// Get request raw json from postman / api
app.use(express.json());
// Get request form form-urlencoded form postman / api
app.use(express.urlencoded({ extended: false }));

exports.getUser = (async (req, res, next) => {
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

exports.addUser = (multer().none(), async (req, res, next) => {
  console.log(req.body)
  try {
    const { username, password, firstName, lastName, age, win, lose } = req.body;
    const user_biodataID = new mongoose.Types.ObjectId()
    const user_historyID = new mongoose.Types.ObjectId()
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
      message: error.message
    })
  }

})

exports.updateUser = (multer().none(), async (req, res, next) => {

  try {
    const { username, password, firstName, lastName, age, win, lose } = req.body;
    const id = req.params.id
    console.log(id)
    await User_Game.findOneAndUpdate({ _id: id }, {
      username: username,
      password: password
    }, async (req, res) => {

      await User_Game_Biodata.updateOne(
        { _id: res.userGameBiodata },
        {
          firstName: firstName,
          lastName: lastName,
          age: age
        },
        { runValidators: true }
      )

      await User_Game_History.updateOne(
        { _id: res.userGameHistory },
        {
          win: win,
          lose: lose
        },
        { runValidators: true }
      )
    })

    res.send({
      status: "Successfully Updated"
    })
  } catch (error) {
    res.send({
      status: "failed to update",
      message: error.message
    })
  }

})

exports.deleteUser = (async (req, res, next) => {
  try {
    const id = req.params.id;
    await User_Game.findOneAndDelete({ _id: id }, async (err, res) => {
      try {
        await User_Game_Biodata.deleteOne({ _id: res.userGameBiodata })
        await User_Game_History.deleteOne({ _id: res.userGameHistory })
      } catch (error) {
        console.error(error.message)
      }
    })
    res.send({
      status: "Deleted",
      message: "Document Successfully Deleted",
      id: id
    })
  } catch (error) {
    res.send({
      status: "failed to delete",
      message: error.message
    })
  }
  res.redirect("/dashboard")
})