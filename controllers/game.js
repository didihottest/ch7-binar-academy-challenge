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
exports.fight = async (req, res, next) => {
  const roomName = req.params.roomname
  try {
    const foundRoom = await Room.findOne({ name: roomName })
    if (foundRoom) {
      const username = req.username
      const loginUserCheck = playersLoggedin.includes(username)
      if (!loginUserCheck) {
        playersLoggedin.push(username)
      }
      class Game {
        constructor(username) {
          this.player = username;
        }
        userInput() {
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
            return playerChoices
          }
        }
      }
      if (playersLoggedin.length == 1 ) {
        res.status(200).json({
          message: 'waiting for other player'
        })
      }
      const startBattle = new Promise((resolve, reject) => {
        if (playersLoggedin.length == 2) {
          let player1 = new Game(playersLoggedin[0])
          let player2 = new Game(playersLoggedin[1])
          let player1Choosen = player1.userInput()
          let player2Choosen = player2.userInput()
          let playersChoosen = [player1Choosen, player2Choosen]

          if (playersChoosen.length == 2) {
            resolve(playersChoosen)
          } else {
            reject('one or more player didnt choose')
          }
        }
      })
      const resultBattle = await startBattle
      res.send(resultBattle)
        

      if (playersLoggedin.length > 2) {
        res.status(200).json({
          message: 'Room is full'
        })
      }

    } else {
      res.status(400).json({
        message: `${roomName} not Found`
      })
    }

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