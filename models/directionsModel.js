const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function getDirectionsByClinicId(clinicId) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      SELECT direction_id, step_number, instruction, icon_path
      FROM Directions
      WHERE clinic_id = @clinicId
      ORDER BY step_number ASC
    `;
    const request = connection.request();
    request.input("clinicId", clinicId);
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

async function createDirection(data) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      INSERT INTO Directions (clinic_id, step_number, instruction, icon_path)
      VALUES (@clinic_id, @step_number, @instruction, @icon_path)
    `;
    const request = connection.request();
    request.input("clinic_id", sql.Int, data.clinic_id);
    request.input("step_number", sql.Int, data.step_number);
    request.input("instruction", sql.NVarChar, data.instruction);
    request.input("icon_path", sql.NVarChar, data.icon_path || null);
    await request.query(query);
    return { message: "Direction added successfully" };
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

async function updateDirectionByClinicId(clinicId, data) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      UPDATE Directions
      SET instruction = @instruction,
          icon_path = @icon_path
      WHERE clinic_id = @clinicId AND step_number = @step_number
    `;
    const request = connection.request();
    request.input("clinicId", sql.Int, clinicId);
    request.input("step_number", sql.Int, data.step_number);
    request.input("instruction", sql.NVarChar, data.instruction);
    request.input("icon_path", sql.NVarChar, data.icon_path || null);
    await request.query(query);
    return { message: "Direction updated successfully" };
  } finally {
    if (connection) await connection.close();
  }
}

async function deleteDirectionById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("id", sql.Int, id);
    await request.query(`DELETE FROM Directions WHERE direction_id = @id`);
    return { message: "Direction deleted successfully" };
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  getDirectionsByClinicId,
  createDirection,
  updateDirectionByClinicId,
  deleteDirectionById
};
