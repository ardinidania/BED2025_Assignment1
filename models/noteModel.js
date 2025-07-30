const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function getAllNotes(userId) {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .query("SELECT * FROM Notes WHERE userId = @userId ORDER BY noteId DESC");
  return result.recordset;
}

async function getNoteById(noteId, userId) {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("noteId", sql.Int, noteId)
    .input("userId", sql.Int, userId)
    .query("SELECT * FROM Notes WHERE noteId = @noteId AND userId = @userId");
  return result.recordset[0];
}

async function createNote(noteData) {
  const { title, savedName, clinicName, filePath, userId } = noteData;

  console.log("noteData", noteData)

  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("title", sql.NVarChar(100), title)
    .input("savedName", sql.NVarChar(100), savedName)
    .input("clinicName", sql.NVarChar(100), clinicName)
    .input("filePath", sql.NVarChar(255), filePath ? filePath : null)
    .input("userId", sql.Int, userId)
    .query(`INSERT INTO Notes (title, savedName, clinicName, filePath, userId)
            OUTPUT INSERTED.*
            VALUES (@title, @savedName, @clinicName, @filePath, @userId)`);
  return result.recordset[0];
}

async function updateNote(noteId, noteData, userId) {
  const { title, savedName, clinicName, filePath } = noteData;
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("noteId", sql.Int, noteId)
    .input("title", sql.NVarChar(100), title)
    .input("savedName", sql.NVarChar(100), savedName)
    .input("clinicName", sql.NVarChar(100), clinicName)
    .input("filePath", sql.NVarChar(255), filePath ? filePath : null)
    .input("userId", sql.Int, userId)
    .query(`UPDATE Notes
            SET title = @title, savedName = @savedName, clinicName = @clinicName, filePath = @filePath
            OUTPUT INSERTED.*
            WHERE noteId = @noteId AND userId = @userId`);
  return result.recordset[0];
}

async function deleteNote(noteId, userId) {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("noteId", sql.Int, noteId)
    .input("userId", sql.Int, userId)
    .query("DELETE FROM Notes OUTPUT DELETED.* WHERE noteId = @noteId AND userId = @userId");
  return result.recordset[0];
}

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};