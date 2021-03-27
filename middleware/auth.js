const expressJWT = require('express-jwt')

exports.requireJWT = expressJWT({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'], // added later
  userProperty: 'auth',
})
