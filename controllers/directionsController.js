const directionModel = require("../models/directionsModel");

async function getDirections(req, res) {
  try {
    const clinicId = parseInt(req.params.clinicId);
    if (isNaN(clinicId)) {
      return res.status(400).json({ error: "Invalid clinic ID" });
    }

    const directions = await directionModel.getDirectionsByClinicId(clinicId);
    res.json(directions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch directions" });
  }
}

async function createDirection(req, res) {
  try {
    const result = await directionModel.createDirection(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Controller error:", error); // This stays
    res.status(500).json({ error: "Failed to create direction", details: error.message }); // Add details
  }
}


async function deleteDirection(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid direction ID" });
    }

    const result = await directionModel.deleteDirectionById(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete direction" });
  }
}

module.exports = {
  getDirections,
  createDirection,
  deleteDirection
};