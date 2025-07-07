const express = require('express');
const router = express.Router();
const controller = require('../controllers/savedPlacesController');

// Route to get all saved places for a user
router.get('/saved-places/:userId', controller.getSavedPlaces);

// Route to add a saved place
router.post('/saved-places', controller.addSavedPlace);

// Route to delete a saved place by id
router.delete('/saved-places/:id', controller.deleteSavedPlace);

module.exports = router;
