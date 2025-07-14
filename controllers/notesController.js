const sql = require('mssql');
const dbPromise = require('../dbConfig');

// Create a new note
exports.createNote = async (req, res) => {
  const { userId, title, savedName, clinicName } = req.body;
  let fileUrl = null;

  // If a file was uploaded, save its relative path
  if (req.file) {
    fileUrl = 'uploads/' + req.file.filename; // Path to access the file
  }

  try {
    const db = await dbPromise;
    await db.request()
      .input('userId', sql.VarChar, userId)
      .input('title', sql.VarChar, title)
      .input('savedName', sql.VarChar, savedName)
      .input('clinicName', sql.VarChar, clinicName)
      .input('fileUrl', sql.VarChar, fileUrl)
      .query(`
        INSERT INTO Notes (userId, title, savedName, clinicName, fileUrl)
        VALUES (@userId, @title, @savedName, @clinicName, @fileUrl)
      `);

    res.status(201).json({ msg: 'Note added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

// Get notes by user
exports.getNotesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const db = await dbPromise;
    const result = await db.request()
      .input('userId', sql.VarChar, userId)
      .query('SELECT * FROM Notes WHERE userId = @userId ORDER BY createdAt DESC');

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
