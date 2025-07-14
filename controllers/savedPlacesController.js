const savedPlacesModel = require("../models/savedPlacesModel");

async function getSavedPlaces(req, res) {
  try {
    const places = await savedPlacesModel.getSavedPlacesByUserId(req.userId);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved places." });
  }
}

async function addSavedPlace(req, res) {
  const { label, address, phone } = req.body;

  if (!label || !address) {
    return res.status(400).json({ message: "Label and address are required." });
  }

  try {
    // Check if already exists
    const existingPlaces = await savedPlacesModel.getSavedPlacesByUserId(req.userId);
    const duplicate = existingPlaces.find(place => place.label === label);

    if (duplicate) {
      return res.status(409).json({ message: "Place already saved." });
    }

    const result = await savedPlacesModel.addSavedPlace({
      label,
      address,
      phone,
      userId: req.userId
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error adding saved place." });
  }
}

async function deleteSavedPlace(req, res) {
  const id = req.params.id;

  try {
    const result = await savedPlacesModel.deleteSavedPlaceById(id, req.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error deleting saved place." });
  }
}

module.exports = {
  getSavedPlaces,
  addSavedPlace,
  deleteSavedPlace
};
