const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  fetchNotes,
  fetchNoteById,
  createNote,
  updateNote,
  deleteNote
} = require("../controllers/notesController");
const { validateNoteData } = require("../middlewares/validateNote");

// Multer setup
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get("/", fetchNotes);
router.get("/:id", fetchNoteById);
router.post("/", upload.single("file"), validateNoteData, createNote);
router.put("/:id", upload.single("file"), validateNoteData, updateNote);
router.delete("/:id", deleteNote);

module.exports = router;