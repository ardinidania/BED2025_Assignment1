const reminderModel = require("../models/reminderModel");

// GET /reminders/:userId
async function getReminders(req, res) {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const reminders = await reminderModel.getRemindersByUserId(userId);
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
}

// POST /reminders
async function postReminder(req, res) {
  try {
    const success = await reminderModel.createReminder(req.body);
    if (success) {
      res.status(201).json({ message: "Reminder created successfully" });
    } else {
      res.status(400).json({ error: "Failed to create reminder" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error while creating reminder" });
  }
}

// DELETE /reminders/:id
async function deleteReminder(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid reminder ID" });
  }

  try {
    const success = await reminderModel.deleteReminderById(id);
    if (success) {
      res.json({ message: "Reminder deleted successfully" });
    } else {
      res.status(404).json({ error: "Reminder not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error while deleting reminder" });
  }
}


module.exports = {
  getReminders,
  postReminder,
  deleteReminder
};