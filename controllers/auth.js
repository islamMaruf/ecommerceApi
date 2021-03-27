const User = require('../models/user')
const { errorHandler } = require('../helpers/dbErrorHandlers')
const { generateJsonToken } = require('../services/jsonToken')

const signUp = (req, res) => {
  const user = new User(req.body)
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      })
    }
    user.salt = undefined
    user.hashed_password = undefined
    return res.status(200).json({
      user: user,
      message: 'User signup successfully',
    })
  })
}
const signIn = (req, res) => {
  const { email, password } = req.body
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(404).json({
        err: "User with that email doesn't exist. Please sign up",
      })
    }
    if (!user.authenticate(password)) {
      return res.status('401').json({
        err: "Email and password doesn't match",
      })
    }
    generateJsonToken(user, req, res)
  })
}
const signOut = (req, res) => {
  res.clearCookie('t')
  res.status(404).json({ message: 'Signout successfully' })
}

module.exports = {
  signUp,
  signIn,
  signOut,
}
