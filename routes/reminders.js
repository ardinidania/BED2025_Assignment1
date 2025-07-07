const express = require("express");
const router = express.Router();
const {
  getReminders,
  postReminder
} = require("../controllers/remindersController");
const validateReminder = require("../middlewares/validateReminder");

router.get("/:userId", getReminders);
router.post("/", validateReminder, postReminder);

module.exports = router;