const express = require("express");
const router = express.Router();

const {
  create,
  show,
  update,
  remove,
  list,
  listRelated,
  listCategories,
} = require("../controllers/product");

const { userById, isAuth, isAdmin } = require("../middleware/user");
const { productById } = require("../middleware/product");
const { requireJWT } = require("../middleware/auth");

router.get("/products", list);
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
router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
