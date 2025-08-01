validateNote:
function validateNoteData(req, res, next) {
  const { title, savedName, clinicName } = req.body;
if (!title || !savedName || !clinicName) {
    return res.status(400).json({ error: "Title, Saved Name, and Clinic Name are required" });
  }
  next();
}

module.exports = { validateNoteData };