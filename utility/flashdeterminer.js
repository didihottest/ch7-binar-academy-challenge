// flash error deteriminer function 
const flashDeterminer = (req) => {
  let messageSuccess = req.flash('success')
  let messageError = req.flash('error')
  if (messageSuccess.length > 0) {
    messageSuccess = messageSuccess[0]
  } else {
    messageSuccess = null
  }
  if (messageError.length > 0) {
    messageError = messageError[0]
  } else {
    messageError = null
  }
  let messages = [messageSuccess, messageError]
  return messages
}

module.exports = flashDeterminer