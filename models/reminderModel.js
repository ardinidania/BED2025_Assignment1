const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function getRemindersByUserId(userId) {
  const pool = await sql.connect(dbConfig);
  const result = await pool
    .request()
    .input("userId", sql.Int, userId)
    .query("SELECT * FROM Reminders WHERE userId = @userId");
  return result.recordset;
}

async function createReminder(data) {
  const pool = await sql.connect(dbConfig);
  await pool
    .request()
    .input("description", sql.NVarChar, data.description)
    .input("time", sql.VarChar, data.time)
    .input("type", sql.VarChar, data.type)
    .input("day", sql.VarChar, data.day)
    .input("userId", sql.Int, data.userId)
    .query(`INSERT INTO Reminders (description, time, type, day, userId)
            VALUES (@description, @time, @type, @day, @userId)`);
  return true;
}

async function deleteReminderById(id, userId) {
  const pool = await sql.connect(dbConfig);
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("userId", sql.Int, userId)
    .query("DELETE FROM Reminders WHERE id = @id AND userId = @userId");
  return result.rowsAffected[0] > 0;
}

async function updateReminderById(id, userId, data) {
  const pool = await sql.connect(dbConfig);
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("userId", sql.Int, userId)
    .input("description", sql.NVarChar, data.description)
    .input("time", sql.VarChar, data.time)
    .input("type", sql.VarChar, data.type)
    .query(`UPDATE Reminders 
            SET description = @description, time = @time, type = @type
            WHERE id = @id AND userId = @userId`);
  return result.rowsAffected[0] > 0;
}

module.exports = {
  getRemindersByUserId,
  createReminder,
  deleteReminderById,
  updateReminderById
};