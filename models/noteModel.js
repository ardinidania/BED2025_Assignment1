const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Create a new note
async function createNote({ userId, title, savedName, clinicName, fileUrl }) {
  const db = await dbConfig;
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
}

// Get all notes for a specific user
async function getNotesByUser(userId) {
  const db = await dbConfig;
  const result = await db.request()
    .input('userId', sql.VarChar, userId)
    .query(`
      SELECT * FROM Notes 
      WHERE userId = @userId 
      ORDER BY createdAt DESC
    `);
  return result.recordset;
}

// Optional: Delete a note (if needed)
async function deleteNoteById(noteId) {
  const db = await dbConfig;
  const result = await db.request()
    .input('noteId', sql.Int, noteId)
    .query('DELETE FROM Notes WHERE noteId = @noteId');
  return result.rowsAffected[0] > 0;
}

module.exports = {
  createNote,
  getNotesByUser,
  deleteNoteById // only if you're using this
};
