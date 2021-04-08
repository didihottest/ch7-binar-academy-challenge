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
  const user_games = await User_Game.find()
  if (user_games.length > 0) {
    res.send({
      status: 'success to get data',
      data: user_games
    })
  } else {
    res.send({
      status: 'No data'
    })
  }
})

routers.post("/api/adduser", multer().none(), async (req, res) => {
  const { username, password, firstName, lastName, age, win, lose } = req.body;
  try {
    const newUser = new User_Game({
      _id: new mongoose.Types.ObjectId(),
      username: username,
      password: password,
    })
    newUser.save((err) => {
      if (err) {
        return handleError(err)
      } else {
        const user_biodata = new User_Game_Biodata({
          user_id: newUser._id,
          firstName: firstName,
          lastName: lastName,
          age: age
        })
        user_biodata.save((err) => {
          if (err) {
            return handleError(err)
          } else {
            const user_history = new User_Game_History({
              user_id: newUser._id,
              win: win,
              lose: lose
            })
            user_history.save((err)=>{
              if (err) return handleError(err)
            })
          }
        })
      }
    })
    if (newUser) {
      res.send({
        status: "Successfuly added",
        data: newUser
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