const express = require('express');
const router = express.Router();
const controller = require('../controllers/savedPlacesController');

// Route to get all saved places for a user
router.get('/:userId', controller.getSavedPlaces);

// ✅ Corrected: POST and DELETE should just be relative
router.post('/', controller.addSavedPlace);
router.delete('/:id', controller.deleteSavedPlace);

module.exports = router;
