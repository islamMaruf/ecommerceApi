const express = require("express");
const router = express.Router();

const { signUp, signIn, signOut } = require("../controllers/auth");
const { signupValidator } = require("../middleware/validator");

router.post("/sign-up", signupValidator, signUp);
router.post("/sign-in", signIn);
router.get("/sign-out", signOut);

module.exports = router;
