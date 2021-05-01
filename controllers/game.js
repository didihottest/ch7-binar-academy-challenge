const User_Game = require('../model/user_game')
const Room = require('../model/room')
const jwt = require('jsonwebtoken')
const { collection } = require('../model/room')


exports.getGame = async (req, res, next) => {

  //   const token = req.cookies.jwt
  //   if (token) {
  //     jwt.verify(token, 'secret', (err, decodedToken) => {
  //       let id = decodedToken.id
  //       const loginUserCheck = loggedIn.includes(id)
  //       if (!loginUserCheck) {
  //         loggedIn.push(id)
  //       }
  //     })
  //   } else {
  //     res.redirect('/login-dashboard')
  //   }
  //   const player1 = loggedIn[0]
  //   const player2 = loggedIn[1]
  //   res.send(loggedIn)
}
let playersLoggedin = []
exports.fight = (req, res, next) => {
  const roomName = req.params.roomname
  try {
    Room.findOne({ name: roomName })
      .then(foundRoom => {
        if (foundRoom) {
          // console.log(foundRoom)
          const username = req.username
          const loginUserCheck = playersLoggedin.includes(username)
          if (!loginUserCheck) {
            playersLoggedin.push(username)
          }
          // console.log(playersLoggedin)
          class Game {
            constructor(username) {
              this.player = username;
            }
            userInput() {
              return new Promise((resolve, reject) => {
                let rps = ['rock', 'paper', 'scissor']
                let choosen = []
                if (this.player) {
                  for (let i = 0; i < rps.length; i++) {
                    let randomChoice = Math.floor(Math.random() * 3)
                    choosen.push(rps[randomChoice]);
                  }
                  let playerChoices = {
                    playerName: this.player,
                    choice: choosen
                  }
                  resolve(playerChoices)
                } else {
                  reject('error promise')
                }
              })
            }
          }
          let playersFight = {}
          if (playersLoggedin == 1 ) {
            
          }
          if (playersLoggedin.length == 2) {
            let player1 = new Game(playersLoggedin[0])
            player1.userInput().then(player1Choosen => {
              let player2 = new Game(playersLoggedin[1])
              player2.userInput().then(player2Choosen => {
                console.log(player1Choosen, player2Choosen)
                return playersFight = {
                  player1: player1Choosen,
                  player2: player2Choosen
                }
              }).catch(error => {
                console.log(error)
              })
            })
            console.log(playersFight)
          } else if (playersLoggedin > 2) {
            res.status(200).json({
              message: 'Room is full'
            })
          }

        } else {
          res.status(400).json({
            message: `${roomName} not Found`
          })
        }
      }).catch(error => {
        res.status(400).json(error)
      })
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.createRoom = async (req, res, next) => {
  const name = req.body.name
  const id = req.userId
  try {
    const createdRoom = await Room.create({ creator: id, name: name })
    res.status(201).json({
      status: "success",
      message: "Room Created",
      roomName: createdRoom.name
    })
  } catch (error) {
    if (error.code == 11000) {
      const errorMessage = "Room Name already Used, use another Name"
      res.status(400).json(errorMessage)
    } else {
      res.status(400).json(error)
    }
  }
}