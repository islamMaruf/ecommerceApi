const express = require("express");
const router = express.Router();

const { userById, isAuth, isAdmin } = require("../middleware/user");
const { requireJWT } = require("../middleware/auth");

router.get("/secret/:userId", requireJWT, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

router.param("userId", userById);

module.exports = router;
