const express = require("express");
const router = express.Router();
const { fetchClinics, createClinic, updateClinic, deleteClinic } = require("../controllers/clinicsController");
const { validateClinic } = require("../middlewares/validateClinic");

router.get("/", fetchClinics);
router.post("/", validateClinic, createClinic);
router.put("/:id", validateClinic, updateClinic);
router.delete("/:id", deleteClinic);

module.exports = router;
