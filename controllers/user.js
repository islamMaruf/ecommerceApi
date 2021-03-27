const User = require('../models/user')
const { errorHandler } = require('../helpers/dbErrorHandlers.js')

const list = (req, res) => {
  User.find().exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: 'User not found',
      })
    }
    return res.status(200).json({
      users,
      message: 'Users found successfully',
    })
  })
}

const show = (req, res) => {
  return res.json({
    user: req.profile,
  })
}

const create = (req, res) => {
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
      message: 'User created successfully',
    })
  })
}

const update = (req, res) => {
  let user = req.profile
  user = _.extend(user, req.body)
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          err: 'You are not authorised to perform this action',
        })
      }
      user.salt = undefined
      user.hashed_password = undefined
      return res.status(200).json({
        user: user,
        message: 'User updated successfully',
      })
    },
  )
}

const remove = (req, res) => {
  let user = req.profile
  user.remove((err, deletedCategory) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      })
    }
    return res.status(202).json({
      message: 'User deleted successfully',
    })
  })
}

module.exports = {
  create,
  show,
  update,
  remove,
  list,
}
