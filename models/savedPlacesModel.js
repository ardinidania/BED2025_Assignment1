const sql = require("mssql");
const config = require("../dbConfig");

async function getSavedPlacesByUserId(userId) {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .query("SELECT * FROM SavedPlaces WHERE userId = @userId");
  return result.recordset;
}

async function addSavedPlace({ label, address, phone, userId }) {
  const pool = await sql.connect(config);
  await pool.request()
    .input("label", sql.NVarChar, label)
    .input("address", sql.NVarChar, address)
    .input("phone", sql.NVarChar, phone)
    .input("userId", sql.Int, userId)
    .query("INSERT INTO SavedPlaces (userId, label, address, phone) VALUES (@userId, @label, @address, @phone)");
  return { message: "Saved place added." };
}

async function updateSavedPlaceById(id, userId, { label, address, phone }) {
  const pool = await sql.connect(config);
  await pool.request()
    .input("id", sql.Int, id)
    .input("userId", sql.Int, userId)
    .input("label", sql.NVarChar, label)
    .input("address", sql.NVarChar, address)
    .input("phone", sql.NVarChar, phone)
    .query(`
      UPDATE SavedPlaces 
      SET label = @label, address = @address, phone = @phone
      WHERE id = @id AND userId = @userId
    `);
  return { message: "Saved place updated." };
}

async function deleteSavedPlaceById(id, userId) {
  const pool = await sql.connect(config);
  await pool.request()
    .input("id", sql.Int, id)
    .input("userId", sql.Int, userId)
    .query("DELETE FROM SavedPlaces WHERE id = @id AND userId = @userId");
  return { message: "Saved place deleted." };
}

module.exports = {
  getSavedPlacesByUserId,
  addSavedPlace,
  updateSavedPlaceById,
  deleteSavedPlaceById
};
