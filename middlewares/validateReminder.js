function validateReminder(req, res, next) {
  const { description, time, type, day } = req.body;

  if (!description || !time || !type || !day) {
    return res.status(400).json({ error: "All fields are required." });
  }

  next();
}

module.exports = validateReminder;
