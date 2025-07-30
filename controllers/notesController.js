const noteModel = require("../models/noteModel");

async function fetchNotes(req, res) {
  try {
    const notes = await noteModel.getAllNotes(req.userId);
    res.status(200).json(notes);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
}

async function fetchNoteById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid note ID" });

    const note = await noteModel.getNoteById(id, req.userId);
    if (!note) return res.status(404).json({ error: "Note not found" });

    res.status(200).json(note);
  } catch (err) {
    console.error("Fetch single error:", err);
    res.status(500).json({ error: "Failed to fetch note" });
  }
}

async function createNote(req, res) {
  try {
    const { title, savedName, clinicName } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;


    console.log("req.body", req.body)
    const newNote = await noteModel.createNote({
      title,
      savedName,
      clinicName,
      filePath,
      userId: req.userId
    });

    res.status(201).json(newNote);
  } catch (err) {
    console.log("Create error:", err);
    res.status(500).json({ error: "Failed to create note" });
  }
}

async function updateNote(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid note ID" });

    const { title, savedName, clinicName } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
    const updated = await noteModel.updateNote(id, {
      title,
      savedName,
      clinicName,
      filePath
    }, req.userId);

    if (!updated) return res.status(404).json({ error: "Note not found" });

    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
}

async function deleteNote(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid note ID" });

    const deleted = await noteModel.deleteNote(id, req.userId);
    if (!deleted) return res.status(404).json({ error: "Note not found" });

    res.json({ message: "Note deleted", note: deleted });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
}

module.exports = {
  fetchNotes,
  fetchNoteById,
  createNote,
  updateNote,
  deleteNote
};