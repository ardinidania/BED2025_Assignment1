const directionModel = require("../models/directionsModel");

exports.createNote = async (req, res) => {
  const { userId, title, savedName, clinicName } = req.body;
  let fileUrl = req.file ? 'uploads/' + req.file.filename : null;

  try {
    await noteModel.createNote({ userId, title, savedName, clinicName, fileUrl });
    res.status(201).json({ msg: 'Note added successfully' });
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ msg: err.message });
  }
};

exports.getNotesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const notes = await noteModel.getNotesByUser(userId);
    res.json(notes);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ msg: err.message });
  }
};
