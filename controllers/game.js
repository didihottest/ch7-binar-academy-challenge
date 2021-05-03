// import model from user_game file
const { User_Game, User_Game_History } = require('../model/user_game')
// import model from room model
const Room = require('../model/room')

// variable to assign logged in user
let playersLoggedin = []
exports.fight = async (req, res, next) => {
  const roomName = req.params.roomname
  try {
    // check if the requested room is available
    const foundRoom = await Room.findOne({ name: roomName })
    if (foundRoom) {
      const username = req.username
      // check if duplicate user is trying to access
      const loginUserCheck = playersLoggedin.includes(username)
      if (!loginUserCheck) {
        playersLoggedin.push(username)
      }
      // class for every user who loggin
      class Game {
        constructor(username) {
          this.player = username;
        }
        // user input function that randomize rock paper scissor input
        userInput() {
          // array that contain three choices of game
          let rps = ['rock', 'paper', 'scissor']
          let choosen = []
          if (this.player) {
            // random choice logic
            for (let i = 0; i < rps.length; i++) {
              let randomChoice = Math.floor(Math.random() * 3)
              choosen.push(rps[randomChoice]);
            }
            // assign username and choices to variable
            let playerChoices = {
              playerName: this.player,
              choices: choosen
            }
            // return output data
            return playerChoices
          }
        }
      }
      // send this if only one user entered
      if (playersLoggedin.length == 1) {
        res.status(200).json({
          message: 'waiting for other player'
        })
      }
      // send this if there are more than user entered
      if (playersLoggedin.length > 2) {
        res.status(200).json({
          message: 'Room is full'
        })
      }
      // make promise function to start the battle
      const startBattle = new Promise((resolve, reject) => {
        if (playersLoggedin.length == 2) {
          let player1 = new Game(playersLoggedin[0])
          let player2 = new Game(playersLoggedin[1])
          let player1Choosen = player1.userInput()
          let player2Choosen = player2.userInput()
          let playersChoosen = [player1Choosen, player2Choosen]
          // resolve reject logic
          if (playersChoosen.length == 2) {
            resolve(playersChoosen)
          } else {
            reject('one or more player didnt choose')
          }
        }
      })

      // output of startbattle which is input of everyuser
      const battleInput = await startBattle
      // process the battle using another promise
      const processBattle = new Promise((resolve, reject) => {
        // player 1 input
        let player1Input = battleInput[0]
        // player 2 input
        let player2Input = battleInput[1]
        // player 1 score
        let player1Score = 0
        // player 1 score
        let player2Score = 0
        // loop match for 3 times to get three match
        for (let i = 0; i < player1Input.choices.length; i++) {
          // switch logic for determining score
          switch (player1Input.choices[i] + player2Input.choices[i]) {
            case "rockrock":
            case "scissorscissor":
            case "paperpaper":
              player1Score += 0
              player2Score += 0
              break;
            case "rockscissor":
            case "paperrock":
            case "scissorrock":
              player1Score += 1
              break;
            case "rockpaper":
            case "paperscissor":
            case "scissorrock":
              player2Score += 1
              break;
            default:
              break;
          }
        }

        // winner conditioning
        // player one win condition
        if (player1Score > player2Score) {
          let winner = player1Input.playerName
          let loser = player2Input.playerName
          resolve({ winner: winner, loser: loser })
        } else {
          // player 2 win condition
          let winner = player2Input.playerName
          let loser = player1Input.playerName
          resolve({ winner: winner, loser: loser })
        }
      })
      // store match result to result battle
      let resultBattle = await processBattle
      // assign winner and loser username to variable
      let winner = resultBattle.winner
      let loser = resultBattle.loser
      try {
        // update history of winner
        // find entity who wins
        const winnerDb = await User_Game.findOne({ username: winner })
        const winnerDbHistory = await User_Game_History.findOne({ _id: winnerDb.userGameHistory })
        // update history of winning entity
        await User_Game_History.updateOne({ _id: winnerDbHistory._id }, { win: (winnerDbHistory.win + 1) })
      } catch (error) {
        console.log(error)
      }

      try {
        // update history of loser
        const loserDb = await User_Game.findOne({ username: loser })
        const loserDbHistory = await User_Game_History.findOne({ _id: loserDb.userGameHistory })
        // update history of losing entity
        await User_Game_History.updateOne({ _id: loserDbHistory._id }, { lose: (loserDbHistory.lose + 1) })
      } catch (error) {
        console.log(error)
      }
      res.status(200).json(resultBattle)
    } else {
      // if invalid room name has entered
      res.status(400).json({
        message: `${roomName} not Found`
      })
    }
  } catch (error) {
    // error request handling
    res.status(500).json({
      message: "request Error"
    })
  }


}
// create room endpoint
exports.createRoom = async (req, res, next) => {
  const name = req.body.name
  const id = req.userId
  try {
    // create room
    const createdRoom = await Room.create({ creator: id, name: name })
    // send message if room created
    res.status(201).json({
      status: "success",
      message: "Room Created",
      roomName: createdRoom.name
    })
  } catch (error) {
    if (error.code == 11000) {
      // error handling if there is same room name already used
      const errorMessage = "Room Name already Used, use another Name"
      res.status(400).json(errorMessage)
    } else {
    // error message handling
      res.status(400).json(error)
    }
  }
}

exports.playerHistory = async (req, res, next) => {
  const id = req.userId
  try {
    // populate user active database
    User_Game.findOne({ _id: id })
      .populate('userGameHistory userGameBiodata')
      .exec((err, activeUser) => {
        if (err) {
          res.send({
            status: "failed",
            message: "Wrong ID"
          })
        };
        // assign active user data to variable
        let activeUserhistory = {
          username: activeUser.username,
          firstName: activeUser.userGameBiodata.firstName,
          lastName: activeUser.userGameBiodata.lastName,
          age: activeUser.userGameBiodata.age,
          win: activeUser.userGameHistory.win,
          lose: activeUser.userGameHistory.lose
        }
        // send data to client
        res.status(200).json(activeUserhistory)
      })
  } catch (error) {
    // error message handling
    res.status(400).json({
      status: "Failed to get data",
      message: error.message
    })
  }


}