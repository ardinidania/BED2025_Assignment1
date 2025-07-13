const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentsByUser,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentsController');  // <— must match the file name!

router.get('/', getAllAppointments);
router.get('/user/:userId', getAppointmentsByUser);
router.post('/', createAppointment);
router.put('/:appointmentId', updateAppointment);
router.delete('/:appointmentId', deleteAppointment);

module.exports = router;
