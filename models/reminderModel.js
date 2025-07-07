const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all reminders for a specific user
async function getRemindersByUserId(userId) {
  const pool = await sql.connect(dbConfig);
  const result = await pool
    .request()
    .input("userId", sql.Int, userId)
    .query("SELECT * FROM Reminders WHERE userId = @userId");
  return result.recordset;
}

// Create a new reminder
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

module.exports = {
  getRemindersByUserId,
  createReminder
};