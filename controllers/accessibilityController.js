const sql = require('mssql');
const config = require('../dbConfig');
const accessibilityModel = require('../models/accessibilityModel');

// GET /accessibility-settings/:userId
exports.getSettings = async (req, res) => {
  try {
    await sql.connect(config);
    const userId = parseInt(req.userId);
    const request = new sql.Request();
    request.input('userId', sql.Int, userId);

    const result = await request.query(accessibilityModel.getAccessibilityByUserIdQuery);

    if (!result.recordset || result.recordset.length === 0) {
      return res.status(404).json({ message: `Accessibility settings not found for userId: ${userId}` });
    }

    const settings = result.recordset[0];
    settings.contrastLevel = Number(settings.contrastLevel); // ensure numeric

    res.json(settings);
  } catch (err) {
    console.error('Error in getSettings:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// POST /accessibility-settings
exports.saveSettings = async (req, res) => {
  const userId = parseInt(req.userId);
  const { fontSize, contrastLevel, darkMode } = req.body;

  try {
    await sql.connect(config);
    const request = new sql.Request();

    request.input('userId', sql.Int, userId);
    request.input('fontSize', sql.VarChar(20), fontSize);
    request.input('contrastLevel', sql.Int, contrastLevel);
    request.input('darkMode', sql.Bit, darkMode ? 1 : 0);

    await request.query(accessibilityModel.mergeAccessibilitySettingsQuery);

    res.json({ message: 'Accessibility settings saved successfully' });
  } catch (err) {
    console.error('Error in saveSettings:', err.message);
    res.status(500).json({ error: err.message });
  }
};