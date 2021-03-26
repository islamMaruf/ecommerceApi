const express = require("express");
const router = express.Router();

const {
  create,
  show,
  list,
  update,
  remove,
} = require("../controllers/product");
const { userById, isAuth, isAdmin } = require("../middleware/user");
const { productById } = require("../middleware/product");
const { requireJWT } = require("../middleware/auth");

router.post("/create/product/:userId", requireJWT, isAuth, isAdmin, create);
router.get("/product/:productId", show);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
