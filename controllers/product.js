const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");

const { errorHandler } = require("../helpers/dbErrorHandlers.js");

const list = (req, res) => {
  let { order = "asc", sortBy = "_id", limit = 6 } = req.query;

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(parseInt(limit))
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Products Not found",
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
        console.log({ err });
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

const listRelated = (req, res) => {
  const { limit = 6 } = req.query;
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(parseInt(limit))
    .select("-photo")
    .populate("category", "_id name")
    .exec((err, products) => {
      if (err) {
        console.log({ err });
        return res.status(400).json({
          error: "Products not found",
        });
      }
      return res.status(200).json({
        products,
      });
    });
};
const listCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      console.log({ err });
      return res.status(400).json({
        error: "Products not found",
      });
    }
    return res.status(200).json({
      categories,
    });
  });
};
const listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select("-photo")
    .populate("category", "id name")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      return res.status(200).json({
        size: products.length,
        products,
      });
    });
};

module.exports = {
  list,
  create,
  show,
  update,
  remove,
  listRelated,
  listCategories,
  listBySearch,
};
