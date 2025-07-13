// models/appointmentModel.js

const sql = require('mssql');
const config = require('../dbConfig');

// Create a new appointment
async function createAppointment(user_id, clinic_id, appointment_date, appointment_time, doctor_name, location, reminder_enabled) {
  let pool;
  try {
    pool = await sql.connect(config);

    const result = await pool
      .request()
      .input('user_id', sql.Int, user_id)
      .input('clinic_id', sql.Int, clinic_id)
      .input('appointment_date', sql.Date, appointment_date)
      .input('appointment_time', sql.Time, appointment_time)
      .input('doctor_name', sql.NVarChar(255), doctor_name)
      .input('location', sql.NVarChar(255), location)
      .input('reminder_enabled', sql.Bit, reminder_enabled)
      .query(`
        INSERT INTO Appointment
          (user_id, clinic_id, appointment_date, appointment_time, doctor_name, location, reminder_enabled)
        VALUES
          (@user_id, @clinic_id, @appointment_date, @appointment_time, @doctor_name, @location, @reminder_enabled);
        SELECT SCOPE_IDENTITY() AS appointment_id;
      `);

    return result.recordset[0].appointment_id;
  } catch (err) {
    console.error('Error creating appointment:', err);
    throw err;
  } finally {
    if (pool) await pool.close();
  }
}

// Get all appointments for a user
async function getAppointmentsByUser(userId) {
  let pool;
  try {
    pool = await sql.connect(config);

    const result = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM Appointment WHERE user_id = @userId');

    return result.recordset;
  } catch (err) {
    console.error('Error fetching appointments:', err);
    throw err;
  } finally {
    if (pool) await pool.close();
  }
}

// Get a specific appointment by ID
async function getAppointmentById(appointmentId) {
  let pool;
  try {
    pool = await sql.connect(config);

    const result = await pool
      .request()
      .input('appointmentId', sql.Int, appointmentId)
      .query('SELECT * FROM Appointment WHERE appointment_id = @appointmentId');

    return result.recordset[0] || null;
  } catch (err) {
    console.error('Error fetching appointment:', err);
    throw err;
  } finally {
    if (pool) await pool.close();
  }
}

// Update an appointment by ID
async function updateAppointment(appointmentId, user_id, clinic_id, appointment_date, appointment_time, doctor_name, location, reminder_enabled) {
  let pool;
  try {
    pool = await sql.connect(config);

    const result = await pool
      .request()
      .input('appointmentId', sql.Int, appointmentId)
      .input('user_id', sql.Int, user_id)
      .input('clinic_id', sql.Int, clinic_id)
      .input('appointment_date', sql.Date, appointment_date)
      .input('appointment_time', sql.Time, appointment_time)
      .input('doctor_name', sql.NVarChar(255), doctor_name)
      .input('location', sql.NVarChar(255), location)
      .input('reminder_enabled', sql.Bit, reminder_enabled)
      .query(`
        UPDATE Appointment
        SET
          user_id = @user_id,
          clinic_id = @clinic_id,
          appointment_date = @appointment_date,
          appointment_time = @appointment_time,
          doctor_name = @doctor_name,
          location = @location,
          reminder_enabled = @reminder_enabled
        WHERE appointment_id = @appointmentId
      `);

    return result.rowsAffected[0] > 0;
  } catch (err) {
    console.error('Error updating appointment:', err);
    throw err;
  } finally {
    if (pool) await pool.close();
  }
}

// Delete an appointment by ID
async function deleteAppointment(appointmentId) {
  let pool;
  try {
    pool = await sql.connect(config);

    const result = await pool
      .request()
      .input('appointmentId', sql.Int, appointmentId)
      .query('DELETE FROM Appointment WHERE appointment_id = @appointmentId');

    return result.rowsAffected[0] > 0;
  } catch (err) {
    console.error('Error deleting appointment:', err);
    throw err;
  } finally {
    if (pool) await pool.close();
  }
}

module.exports = {
  createAppointment,
  getAppointmentsByUser,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
};
