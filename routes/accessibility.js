const express = require('express');
const router = express.Router();
const controller = require('../controllers/accessibilityController');
const validateAccessibility = require('../middlewares/validateAccessibility');

// Base route: /accessibility/accessibility-settings
router.get('/accessibility-settings', controller.getSettings);
router.post('/accessibility-settings', validateAccessibility, controller.saveSettings);
router.put('/accessibility-settings', validateAccessibility, controller.updateSettings);   
router.delete('/accessibility-settings', controller.deleteSettings);                       

module.exports = router;
