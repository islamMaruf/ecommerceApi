const Category = require('../models/category')
const _ = require('lodash')
const { errorHandler } = require('../helpers/dbErrorHandlers.js')

const list = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      })
    }
    return res.status(200).json({
      categories: categories,
    })
  })
}

const create = (req, res) => {
  const category = new Category(req.body)
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      })
    }
    return res.status(201).json({
      category: data,
      message: 'Category created successfully',
    })
  })
}

const show = (req, res) => {
  return res.json({
    category: req.category,
    message: 'Category  found',
  })
}

const update = (req, res) => {
  let category = req.category
  category = _.extend(category, req.body)
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      })
    }
    return res.status(200).json({
      category: data,
      message: 'Category updated successfully',
    })
  })
}

const remove = (req, res) => {
  let category = req.category
  category.remove((err, deletedCategory) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      })
    }
    return res.status(202).json({
      message: 'Category deleted successfully',
    })
  })
}

module.exports = {
  list,
  create,
  show,
  update,
  remove,
}
