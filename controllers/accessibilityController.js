const sql = require('mssql');
const config = require('../dbConfig');
const accessibilityModel = require('../models/accessibilityModel');

exports.getSettings = async (req, res) => {
  try {
    await sql.connect(config);
    const query = accessibilityModel.getAccessibilityByUserId(req.params.userId);
    const result = await sql.query(query);

    const settings = result.recordset[0];

    if (settings) {
      // Convert for frontend
      settings.voiceAssist = settings.voiceAssist === 1;
      settings.contrastLevel = Number(settings.contrastLevel);
    }

    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveSettings = async (req, res) => {
  const { userId, fontSize, contrastLevel, voiceAssist } = req.body;

  try {
    await sql.connect(config);
    const query = accessibilityModel.saveOrUpdateAccessibility(userId, fontSize, contrastLevel, voiceAssist);
    await sql.query(query);
    res.json({ message: 'Accessibility settings saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
