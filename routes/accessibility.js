const express = require('express');
const router = express.Router();
const controller = require('../controllers/accessibilityController');

router.get('/accessibility-settings/:userId', controller.getSettings);
router.post('/accessibility-settings', controller.saveSettings);

module.exports = router;
