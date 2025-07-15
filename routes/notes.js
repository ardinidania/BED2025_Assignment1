const express = require('express');
const router = express.Router();
const upload = require('../middlewares/validateNote');
const notesController = require('../controllers/notesController');

router.get('/', (req, res) => {
    res.send("Hello from notes")
})

// Create note with optional file upload
router.post('/', upload.single('file'), notesController.createNote);

// Get notes by userId
router.get('/:userId', notesController.getNotesByUser);



module.exports = router;

