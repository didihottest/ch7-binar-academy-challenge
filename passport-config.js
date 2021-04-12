// use passport local strategy
const LocalStrategy = require('passport-local').Strategy
// function to authenticate user
function initializePassport(passport, getUserByEmail, getUserById) {
  const authenticateUser = (email, password, done) => {
    const user = getUserByEmail(email)
    // if email wrong return this
    if (user != user.email) {
      return done(null, false, { message: 'email incorrect' })
    }
    try {
      // return true if password and entered password same
      if (password == user.password) {
        return done(null, user)
        // logic if false 
      } else {
        return done(null, false, { message: 'Password incorrect' })
        
      }
    } catch (e) {
      return done(e)
    }
  }
  // initiate new local strategy and use the authenticate function to determine if user and password true
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  // user serialize
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  //deserialize id
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initializePassport