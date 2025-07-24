const clinicModel = require("../models/clinicModel");

async function fetchClinics(req, res) {
  try {
    const clinics = await clinicModel.getAllClinics();
    res.status(200).json(clinics);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch clinics" });
  }
}

async function createClinic(req, res) {
  try {
    const newClinic = await clinicModel.createClinic(req.body);
    res.status(201).json(newClinic);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ error: "Failed to create clinic" });
  }
}

async function deleteClinic(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid clinic ID" });

    const deleted = await clinicModel.deleteClinic(id);
    if (!deleted) return res.status(404).json({ error: "Clinic not found" });

    res.json({ message: "Clinic deleted", clinic: deleted });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete clinic" });
  }
}

module.exports = {
  fetchClinics,
  createClinic,
  deleteClinic
};