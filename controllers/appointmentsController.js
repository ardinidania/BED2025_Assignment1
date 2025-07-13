// controllers/appointmentsController.js

const sql = require('mssql');
const config = require('../dbConfig');

// 1) GET /appointments — return all rows
async function getAllAppointments(req, res) {
  let pool;
  try {
    pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Appointment');
    return res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching all appointments:', err);
    return res.status(500).json({ message: err.message });
  } finally {
    if (pool) await pool.close();
  }
}

// 2) GET /appointments/user/:userId — return only that user’s rows
async function getAppointmentsByUser(req, res) {
  const userId = parseInt(req.params.userId, 10);
  let pool;
  try {
    pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM Appointment WHERE user_id = @userId');
    return res.json(result.recordset);
  } catch (err) {
    console.error(`Error fetching appointments for user ${userId}:`, err);
    return res.status(500).json({ message: err.message });
  } finally {
    if (pool) await pool.close();
  }
}

// 3) POST /appointments — insert a new appointment
async function createAppointment(req, res) {
  const {
    user_id,
    clinic_id,
    appointment_date,
    appointment_time,
    doctor_name,
    location,
    reminder_enabled = false
  } = req.body;

  if (
    user_id == null ||
    clinic_id == null ||
    !appointment_date ||
    !appointment_time ||
    !doctor_name ||
    !location
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let pool;
  try {
    pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('user_id', sql.Int, user_id)
      .input('clinic_id', sql.Int, clinic_id)
      .input('appointment_date', sql.Date, appointment_date)
      .input('appointment_time', sql.VarChar(8), appointment_time)
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

    const newId = result.recordset[0].appointment_id;
    return res
      .status(201)
      .json({ message: 'Appointment created', appointment_id: newId });
  } catch (err) {
    console.error('Error creating appointment:', err);
    return res.status(500).json({ message: err.message });
  } finally {
    if (pool) await pool.close();
  }
}

// 4) PUT /appointments/:appointmentId — update an existing appointment
async function updateAppointment(req, res) {
  const appointmentId = parseInt(req.params.appointmentId, 10);
  const {
    user_id,
    clinic_id,
    appointment_date,
    appointment_time,
    doctor_name,
    location,
    reminder_enabled
  } = req.body;

  let pool;
  try {
    pool = await sql.connect(config);

    // check existence
    const check = await pool
      .request()
      .input('appointmentId', sql.Int, appointmentId)
      .query('SELECT 1 FROM Appointment WHERE appointment_id = @appointmentId');

    if (!check.recordset.length) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // perform update
    await pool
      .request()
      .input('appointmentId', sql.Int, appointmentId)
      .input('user_id', sql.Int, user_id)
      .input('clinic_id', sql.Int, clinic_id)
      .input('appointment_date', sql.Date, appointment_date)
      .input('appointment_time', sql.VarChar(8), appointment_time)
      .input('doctor_name', sql.NVarChar(255), doctor_name)
      .input('location', sql.NVarChar(255), location)
      .input('reminder_enabled', sql.Bit, reminder_enabled)
      .query(`
        UPDATE Appointment
        SET
          user_id          = @user_id,
          clinic_id        = @clinic_id,
          appointment_date = @appointment_date,
          appointment_time = @appointment_time,
          doctor_name      = @doctor_name,
          location         = @location,
          reminder_enabled = @reminder_enabled,
          updated_at       = GETDATE()
        WHERE appointment_id = @appointmentId
      `);

    return res.json({ message: 'Appointment updated' });
  } catch (err) {
    console.error('Error updating appointment:', err);
    return res.status(500).json({ message: err.message });
  } finally {
    if (pool) await pool.close();
  }
}

// 5) DELETE /appointments/:appointmentId — remove an appointment
async function deleteAppointment(req, res) {
  const appointmentId = parseInt(req.params.appointmentId, 10);
  let pool;
  try {
    pool = await sql.connect(config);

    // check existence
    const check = await pool
      .request()
      .input('appointmentId', sql.Int, appointmentId)
      .query('SELECT 1 FROM Appointment WHERE appointment_id = @appointmentId');

    if (!check.recordset.length) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // perform delete
    await pool
      .request()
      .input('appointmentId', sql.Int, appointmentId)
      .query('DELETE FROM Appointment WHERE appointment_id = @appointmentId');

    return res.json({ message: 'Appointment deleted' });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    return res.status(500).json({ message: err.message });
  } finally {
    if (pool) await pool.close();
  }
}

module.exports = {
  getAllAppointments,
  getAppointmentsByUser,
  createAppointment,
  updateAppointment,
  deleteAppointment
};
