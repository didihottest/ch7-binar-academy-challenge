// use express module
const express = require('express');
const app = express();
// use mongoose ODM 
const mongoose = require('mongoose');
// use connection module to connect to database from route
require('./../db/connection')
// import model from db file
const { User_Game, User_Game_Biodata, User_Game_History } = require('./../db/user_game.js')
// to pass form data from body
const multer = require('multer')
// Get request raw json from postman / api
app.use(express.json());
// Get request form form-urlencoded form postman / api
app.use(express.urlencoded({ extended: true }));
// display all users entry from database
exports.getUsers = (async (req, res, next) => {
  try {
    await User_Game.find()
      .populate('userGameBiodata userGameHistory')
      .exec((err, user_game) => {
        if (err) if (err) {
          res.send({
            status: "failed",
            message: "Wrong ID"
          })
        };
        res.send(user_game)
      })
  } catch (error) {
    res.send({
      status: "Failed to get data",
      message: error.message
    })
  }
})

// get one user_games data api
exports.getUser = (async (req, res, next) => {
  const id = req.query.id;
  try {
    User_Game.findOne({ _id: id })
      .populate('userGameBiodata userGameHistory')
      .exec((err, user_game) => {
        if (err) {
          res.send({
            status: "failed",
            message: "Wrong ID"
          })
        };
        res.send(user_game)
      })
  } catch (error) {
    res.send({
      status: "Failed to get data",
      message: error.message
    })
  }
})

// add new user api end point
exports.newUser = (multer().none(), async (req, res, next) => {
  const { username, password, firstName, lastName, age, win, lose } = req.body;
  const user_biodataID = new mongoose.Types.ObjectId() // generate unique id for user_biodataID
  const user_historyID = new mongoose.Types.ObjectId() // user_historyID
  try {
    // insert new data to user_games collection
    const newUser = new User_Game({
      _id: new mongoose.Types.ObjectId(),
      username: username,
      password: password,
      userGameBiodata: user_biodataID,
      userGameHistory: user_historyID
    })
    // insert new data to user_game_biodatas collection
    const user_biodata = new User_Game_Biodata({
      _id: user_biodataID,
      user_id: newUser._id,
      firstName: firstName,
      lastName: lastName,
      age: age
    })
    // insert new data to user_game_histories collection
    const user_history = new User_Game_History({
      _id: user_historyID,
      user_id: newUser._id,
      win: win,
      lose: lose
    })
    // save new data to collections
    user_biodata.save((err) => {
      if (err) {
        console.error(err)
      }
    })
    // save new data to collections
    user_history.save((err) => {
      if (err) {
        console.error(err)
      }
    })
    // save new data to collections
    newUser.save((err) => {
      // if username is not unique tell dashboard that there is duplicated data
      if (err) {
        res.redirect("/dashboard?status=duplicate")
      } else {
        // verificator if new user has value or not
        if (newUser) {
          res.redirect("/dashboard?status=successadd")
        } else {
          res.redirect("/add?status=failed")
        }
      }
    })

  } catch (error) {
    res.send({
      status: 'Fail to add new data',
      message: error.message
    })
  }
})

// edit user_game entry api endpoint
exports.editUser = (multer().none(), async (req, res, next) => {
  const { username, password, firstName, lastName, age, win, lose } = req.body;
  const id = req.params.id
  try {
    await User_Game.findOneAndUpdate({ _id: id }, {
      username: username,
      password: password
    },
      { runValidators: true, context: 'query' }, // enable validator to make username only has unique value
      (err) => { if (err) console.log(err.message) }, // display error message to console
      async (req, res) => { // if there is no error forward to next update process
        await User_Game_Biodata.updateOne( // update User_Game_Biodata value
          { _id: res.userGameBiodata },
          {
            firstName: firstName,
            lastName: lastName,
            age: age
          },
          { runValidators: true }
        )

        await User_Game_History.updateOne( // update User_Game_History value
          { _id: res.userGameHistory },
          {
            win: win,
            lose: lose
          },
          { runValidators: true }
        )
      })
    res.redirect("/dashboard?status=successedit") // redirect with success query
  } catch (error) {
    res.redirect("/dashboard?status=duplicate") // redirect with data dupilcated query
  }

})

// delete user_game entry API endpoint
exports.deleteUser = (async (req, res) => {
  const id = req.params.id;
  try {
    await User_Game.findOneAndDelete({ _id: id }, async (err, res) => { // delete user_games collections
      try {
        await User_Game_Biodata.deleteOne({ _id: res.userGameBiodata })// delete user_game_bioadatas collections
        await User_Game_History.deleteOne({ _id: res.userGameHistory })// delete user_game_histories collections
      } catch (error) {
        console.error(error.message)
      }
    })
    // redirect if success
    res.redirect("/dashboard?status=successdelete")
  } catch (error) {
    res.send({
      status: "failed to delete",
      message: error.message
    })
  }
})