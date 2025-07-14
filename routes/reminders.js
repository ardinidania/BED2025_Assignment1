const express = require("express");
const router = express.Router();
const {
  getReminders,
  postReminder,
  deleteReminder
} = require("../controllers/remindersController");
const validateReminder = require("../middlewares/validateReminder");

router.get("/", getReminders);
router.post("/", validateReminder, postReminder);
router.delete("/:id", deleteReminder);

module.exports = router;

