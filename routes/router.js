// use express module
const express = require('express');
const app = express();
const routers = express.Router();
const { User_Game, User_Game_Biodata, User_Game_History } = require('./../db/user_game.js')
// to pass form data from body
const multer = require('multer')
// use mongoose ODM 
const mongoose = require('mongoose');
// use request module to pull data from API
const request = require('request');
// use connection module to connect to database from route
require('./../db/connection')
// Get request raw json from postman / api
app.use(express.json());
// Get request form form-urlencoded form postman / api
app.use(express.urlencoded({ extended: true }));

// dashboard end route
routers.get('/dashboard', (req, res) => {
  let status = req.query.status;

  let option = {
    url: "http://localhost:3000/api/users",
    method: "GET",
  }
  request(option, (error, response, body) => {
    if (error) {
      res.send("Error data list is not available")
    } else {
      let currentData = JSON.parse(body);
      res.render("crud", {
        data: currentData,
        status: status
      });
    }
  })
})

// edit page end route
routers.get('/edit', (req, res) => {
  let id = req.query.id;
  let option = {
    url: "http://localhost:3000/api/user",
    method: "GET",
    qs: {
      id:id
    }
  }
  request(option, (error, response, body) => {
    if (error) {
      res.send("Error data list is not available")
    } else {
      let currentData = JSON.parse(body);
      if (currentData.status == "failed") {
        res.render("error", {
          headTitle: "Not Found!",
          title: currentData.message,
          subtitle: "Go To Main Page",
          location: "/"
      });
      } else {
        res.render("edit", {
          data: currentData
        });
      }  
      
    }
  })
})

// add user_game endpoint 
routers.get('/add', (req, res)=>{
  const status = req.query.status
  // condition if there is no status query
  if (status != undefined) {
    res.render("add", {
      status: status
    })
    console.log("firstif")
  } else {
    res.render("add", {
      status: null
    })
  }
  
})


// get all user_games data api
routers.get('/api/users', async (req, res) => {
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
routers.get('/api/user', async (req, res) => {
  const id = req.query.id;
  try {
    User_Game.findOne({_id: id})
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
routers.post("/api/user", multer().none(), async (req, res) => {
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
        console.error(err)
      }
    })

    user_biodata.save((err) => {
      if (err) {
        console.error(err)
      }
    })

    user_history.save((err) => {
      if (err) {
        console.error(err)
      }
    })

    // verificator if new user has value or not
    if (newUser) {
      res.redirect("/dashboard?status=successadd")
    } else {
      res.redirect("/add?status=failed")
    }
  } catch (error) {
    res.send({
      status: 'Fail to add new data',
      message: error.message
    })
  } 
})

// edit user_game entry api endpoint
routers.post('/api/useredit/:id', multer().none(), async (req, res) => {
  const { username, password, firstName, lastName, age, win, lose } = req.body;
  const id = req.params.id
  try {
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
    res.redirect("/dashboard?status=successedit")
  } catch (error) {
    res.send({
      status: "failed to update",
      message: error.message
    })
  }
  
})

// delete user_game entry API endpoint
routers.post('/api/userdelete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await User_Game.findOneAndDelete({ _id: id }, async (err, res) => {
      try {
        await User_Game_Biodata.deleteOne({ _id: res.userGameBiodata })
        await User_Game_History.deleteOne({ _id: res.userGameHistory })
      } catch (error) {
        console.error(error.message)
      }
    })
    res.redirect("/dashboard?status=successdelete")
  } catch (error) {
    res.send({
      status: "failed to delete",
      message: error.message
    })
  }
})

module.exports = routers