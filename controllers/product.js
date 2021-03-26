const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");

const { errorHandler } = require("../helpers/dbErrorHandlers.js");

const list = (req, res) => {
  Product.find()
    .select("-photo")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      return res.status(200).json({
        products: products,
      });
    });
};

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
    if (!name || !description || !price || !category || !quantity) {
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

const show = (req, res) => {
  req.product.photo = undefined;
  return res.json({
    product: req.product,
    message: "Product found",
  });
};

const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log({ err });
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    const { name, description, price, category, quantity, shipping } = fields;
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({
        err: "All fields are required",
      });
    }
    let product = req.product;
    product = _.extend(product, fields);

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
      return res.status(200).json({
        message: "Product updated successfully",
        product: data,
      });
    });
  });
};

const remove = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    return res.status(202).json({
      message: "Product deleted successfully",
    });
  });
};

module.exports = {
  list,
  create,
  show,
  update,
  remove,
};
