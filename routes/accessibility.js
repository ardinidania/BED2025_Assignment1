const express = require('express');
const router = express.Router();
const controller = require('../controllers/accessibilityController');


// GET request to get accessibility settings by user ID
router.get('/accessibility-settings/:userId', controller.getSettings);

// POST request with validation middleware
router.post('/accessibility-settings', controller.saveSettings); 

module.exports = router;
