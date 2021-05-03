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
    let resultBattle;
    if (foundRoom) {
      const username = req.username
      // check if duplicate user is trying to access
      const loginUserCheck = playersLoggedin.includes(username)
      if (!loginUserCheck) {
        playersLoggedin.push(username)
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
                choices: choosen
              }
              return playerChoices
            }
          }
        }
        if (playersLoggedin.length == 1) {
          res.status(200).json({
            message: 'waiting for other player'
          })
        }
        if (playersLoggedin.length > 2) {
          res.status(200).json({
            message: 'Room is full'
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
  
  
        const battleInput = await startBattle
        const processBattle = new Promise((resolve, reject) => {
          let player1Input = battleInput[0]
          let player2Input = battleInput[1]
          let player1Score = 0
          let player2Score = 0
          for (let i = 0; i < player1Input.choices.length; i++) {
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
          if (player1Score > player2Score) {
            let winner = player1Input.playerName
            let loser = player2Input.playerName
            resolve({ winner: winner, loser: loser })
          } else {
            let winner = player2Input.playerName
            let loser = player1Input.playerName
            resolve({ winner: winner, loser: loser })
          }
        })
        resultBattle = await processBattle    
        res.status(200).json(resultBattle)
      } else {
        // if same user tried to login send result battle
        res.status(200).json(resultBattle)
      }
      let winner = resultBattle.winner
        let loser = resultBattle.loser
        try {
          const winnerDb = await User_Game.findOne({ username: winner })
          const winnerDbHistory = await User_Game_History.findOne({ _id: winnerDb.userGameHistory })
          await User_Game_History.updateOne({ _id: winnerDbHistory._id }, { win: (winnerDbHistory.win + 1) })
        } catch (error) {
          console.log(error)
        }
  
        try {
          const loserDb = await User_Game.findOne({ username: loser })
          const loserDbHistory = await User_Game_History.findOne({ _id: loserDb.userGameHistory })
          await User_Game_History.updateOne({ _id: loserDbHistory._id }, { lose: (loserDbHistory.lose + 1) })
        } catch (error) {
          console.log(error)
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