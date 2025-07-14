const express = require("express");
const router = express.Router();
const { login, getUserProfile } = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/login", login);
router.get("/profile", verifyToken, getUserProfile);

module.exports = router;


