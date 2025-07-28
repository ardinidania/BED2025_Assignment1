const express = require("express");
const router = express.Router();
const {
  getReminders,
  postReminder,
  deleteReminder,
  updateReminder
} = require("../controllers/remindersController");
const reminderController = require("../controllers/remindersController");
const validateReminder = require("../middlewares/validateReminder");

router.get("/", getReminders);
router.post("/", validateReminder, postReminder);
router.put("/:id", validateReminder, reminderController.updateReminder);
router.delete("/:id", deleteReminder);

module.exports = router;

