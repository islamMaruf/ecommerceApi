const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");

const { errorHandler } = require("../helpers/dbErrorHandlers.js");

const list = {};

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    const { name, description, price, category, quantity, shipping } = fields;
    if (!name || !description || !price || !category || quantity || shipping) {
      return res.status(400).json({
        err: "All fields are required",
      });
    }
    let product = new Product(fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1 mb",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      return res.status(201).json({
        message: "Product created successfully",
        product: data,
      });
    });
  });
};

const show = {};

const update = {};

const remove = {};

module.exports = {
  list,
  create,
  show,
  update,
  remove,
};
