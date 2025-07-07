const sql = require('mssql');
const config = require('../dbConfig');
const savedPlacesModel = require('../models/savedPlacesModel');

// GET all saved places for a user
exports.getSavedPlaces = async (req, res) => {
  const { userId } = req.params;
  try {
    await sql.connect(config);
    const query = savedPlacesModel.getSavedPlacesByUserId(userId);
    const result = await sql.query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST to add a new saved place
exports.addSavedPlace = async (req, res) => {
  const { userId, label, address, phone } = req.body;
  try {
    await sql.connect(config);
    const query = savedPlacesModel.addSavedPlace(userId, label, address, phone);
    await sql.query(query);
    res.status(201).json({ message: 'Saved place added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a saved place
exports.deleteSavedPlace = async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(config);
    const query = savedPlacesModel.deleteSavedPlaceById(id);
    await sql.query(query);
    res.json({ message: 'Saved place deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
