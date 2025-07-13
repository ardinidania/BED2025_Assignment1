const sql = require('mssql');
const config = require('../dbConfig'); // Import the database configuration

// Middleware to validate appointment creation and update data
const validateAppointmentData = (req, res, next) => {
  const { user_id, clinic_id, appointment_date, appointment_time, doctor_name, location, reminder_enabled } = req.body;

  // Validate required fields
  if (!user_id || !clinic_id || !appointment_date || !appointment_time || !doctor_name || !location) {
    return res.status(400).json({ message: 'Missing required fields: user_id, clinic_id, appointment_date, appointment_time, doctor_name, location' });
  }

  // Validate date format (simple check)
  if (isNaN(Date.parse(appointment_date))) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  // Validate reminder_enabled is a boolean
  if (reminder_enabled !== undefined && typeof reminder_enabled !== 'boolean') {
    return res.status(400).json({ message: 'Reminder must be a boolean' });
  }

  next();
};

// Middleware to check if the user is authorized to access or modify the appointment
const checkAppointmentOwnership = async (req, res, next) => {
  const { appointmentId } = req.params; // Appointment ID from URL params
  const { user_id } = req.body; // User ID from the request body (you may pass this as part of the request)

  try {
    // Connect to the SQL database
    await sql.connect(config);

    // Query to get the appointment by ID
    const result = await sql.query`SELECT * FROM Appointment WHERE appointment_id = ${appointmentId}`;

    // If the appointment doesn't exist, return a 404 error
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the user is the owner of the appointment
    if (result.recordset[0].user_id !== user_id) {
      return res.status(403).json({ message: 'You are not authorized to modify or delete this appointment' });
    }

    // If everything is fine, move to the next middleware or controller
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error checking appointment ownership', error: err.message });
  } finally {
    sql.close(); // Close the database connection
  }
};

module.exports = {
  validateAppointmentData,
  checkAppointmentOwnership
};
