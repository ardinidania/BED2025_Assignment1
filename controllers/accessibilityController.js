const sql = require('mssql');
const config = require('../models/dbConfig');
const accessibilityModel = require('../models/accessibilityModel');

exports.getSettings = async (req, res) => {
  try {
    await sql.connect(config);
    const query = accessibilityModel.getAccessibilityByUserId(req.params.userId);
    const result = await sql.query(query);
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveSettings = async (req, res) => {
  const { userId, fontSize, highContrast, voiceAssist } = req.body;
  try {
    await sql.connect(config);
    const query = accessibilityModel.saveOrUpdateAccessibility(userId, fontSize, highContrast, voiceAssist);
    await sql.query(query);
    res.json({ message: 'Accessibility settings saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
