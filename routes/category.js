const express = require("express");
const router = express.Router();

const { create } = require("../controllers/category");
const { userById, isAuth, isAdmin } = require("../middleware/user");
const { requireJWT } = require("../middleware/auth");

router.post("/category/create/:userId", requireJWT, isAuth, isAdmin, create);

router.param("userId", userById);

module.exports = router;
