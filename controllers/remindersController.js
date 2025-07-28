const reminderModel = require("../models/reminderModel");

async function getReminders(req, res) {
  try {
    const reminders = await reminderModel.getRemindersByUserId(req.userId);
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
}

async function postReminder(req, res) {
  try {
    const reminderData = { ...req.body, userId: req.userId };
    const success = await reminderModel.createReminder(reminderData);
    if (success) {
      res.status(201).json({ message: "Reminder created successfully" });
    } else {
      res.status(400).json({ error: "Failed to create reminder" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error while creating reminder" });
  }
}

async function deleteReminder(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid reminder ID" });
  }

  try {
    const success = await reminderModel.deleteReminderById(id, req.userId);
    if (success) {
      res.json({ message: "Reminder deleted successfully" });
    } else {
      res.status(404).json({ error: "Reminder not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error while deleting reminder" });
  }
}

async function updateReminder(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid reminder ID" });
  }

  try {
    const updated = await reminderModel.updateReminderById(id, req.userId, req.body);
    if (updated) {
      res.json({ message: "Reminder updated successfully" });
    } else {
      res.status(404).json({ error: "Reminder not found or not authorized" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error while updating reminder" });
  }
}

module.exports = {
  getReminders,
  postReminder,
  deleteReminder,
  updateReminder
};