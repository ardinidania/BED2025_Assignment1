const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function getAllClinics() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const result = await connection.request().query(`
      SELECT clinic_id, name, address, phone, opening_hours, map_embed, region, latitude, longitude
      FROM Clinics
    `);
    return result.recordset;
  } finally {
    if (connection) await connection.close();
  }
}

async function getClinicById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const result = await connection.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT clinic_id, name, address, phone, opening_hours, map_embed, region, latitude, longitude
        FROM Clinics
        WHERE clinic_id = @id
      `);
    return result.recordset[0] || null;
  } finally {
    if (connection) await connection.close();
  }
}

async function createClinic(data) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      INSERT INTO Clinics (name, address, phone, opening_hours, map_embed, region, latitude, longitude)
      VALUES (@name, @address, @phone, @opening_hours, @map_embed, @region, @latitude, @longitude);
      SELECT SCOPE_IDENTITY() AS clinic_id;
    `;
    const result = await connection.request()
      .input("name", sql.NVarChar, data.name)
      .input("address", sql.NVarChar, data.address)
      .input("phone", sql.NVarChar, data.phone)
      .input("opening_hours", sql.NVarChar, data.opening_hours)
      .input("map_embed", sql.NVarChar, data.map_embed)
      .input("region", sql.NVarChar, data.region)
      .input("latitude", sql.Float, data.latitude)
      .input("longitude", sql.Float, data.longitude)
      .query(query);

    return await getClinicById(result.recordset[0].clinic_id);
  } finally {
    if (connection) await connection.close();
  }
}

async function updateClinic(id, data) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      UPDATE Clinics
      SET name = @name,
          address = @address,
          phone = @phone,
          opening_hours = @opening_hours,
          map_embed = @map_embed,
          region = @region,
          latitude = @latitude,
          longitude = @longitude
      WHERE clinic_id = @id;
    `;
    await connection.request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, data.name)
      .input("address", sql.NVarChar, data.address)
      .input("phone", sql.NVarChar, data.phone)
      .input("opening_hours", sql.NVarChar, data.opening_hours)
      .input("map_embed", sql.NVarChar, data.map_embed)
      .input("region", sql.NVarChar, data.region)
      .input("latitude", sql.Float, data.latitude)
      .input("longitude", sql.Float, data.longitude)
      .query(query);

    return await getClinicById(id);
  } finally {
    if (connection) await connection.close();
  }
}

async function deleteClinic(id) {
  let connection;
  try {
    const clinic = await getClinicById(id);
    if (!clinic) return null;

    connection = await sql.connect(dbConfig);
    await connection.request().input("id", sql.Int, id)
      .query("DELETE FROM Clinics WHERE clinic_id = @id");

    return clinic;
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  getAllClinics,
  getClinicById,
  createClinic,
  updateClinic,
  deleteClinic
};
