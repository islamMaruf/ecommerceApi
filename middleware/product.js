const Product = require("../models/product");

const productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "Product not find",
      });
    }
    req.product = product;
    next();
  });
};

const photo = (req, res, next) => {
  if (req.product.photo.data) {
    console.log({ req: req.product.photo });
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

module.exports = {
  productById,
  photo,
};
