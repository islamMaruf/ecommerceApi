const User = require("../models/user");

const userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not find",
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    req.profile = user;
    next();
  });
};

const isAuth = (req, res, next) => {
  console.log({ req });
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin resource ! Access Denied",
    });
  }
  next();
};

module.exports = {
  userById,
  isAuth,
  isAdmin,
};
