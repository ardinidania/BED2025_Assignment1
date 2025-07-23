const express = require('express');
const router = express.Router();
const controller = require('../controllers/accessibilityController');
const validateAccessibility = require('../middlewares/validateAccessibility'); 
// GET accessibility settings by user ID
router.get('/accessibility-settings', controller.getSettings);

// POST new or updated settings (with validation)
router.post('/accessibility-settings', validateAccessibility, controller.saveSettings);

module.exports = router;
