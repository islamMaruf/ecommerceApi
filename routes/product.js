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
router.delete(
  "/product/:productId/:userId",
  requireJWT,
  isAuth,
  isAdmin,
  remove
);
router.put("/product/:productId/:userId", requireJWT, isAuth, isAdmin, update);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
