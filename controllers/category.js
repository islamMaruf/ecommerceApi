const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandlers.js");

const create = (req, res) => {
  const category = new Category(req.body);
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    return res.status(201).json({
      category: data,
      message: "Category created successfully",
    });
  });
};

module.exports = {
  create,
};
