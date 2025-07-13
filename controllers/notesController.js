const Note = require('../models/noteModel');

exports.createNote = async (req, res) => {
  try {
    const { title, savedName, clinicName, userId } = req.body;

    const noteData = { title, savedName, clinicName, userId };

    if (req.file) {
      noteData.filePath = 'uploads/' + req.file.filename;  // relative path for static serving
      noteData.fileName = req.file.originalname;
    }

    const newNote = await Note.create(noteData);
    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getNotesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ userId });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

