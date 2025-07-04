const express = require('express');
const router = express.Router();
const { fetchClinics, createClinic, deleteClinic } = require('../controllers/clinicsController');
const { validateClinic } = require('../middlewares/validateClinic');

router.get('/', fetchClinics);
router.post('/', validateClinic, createClinic);
router.delete('/:id', deleteClinic);

module.exports = router;