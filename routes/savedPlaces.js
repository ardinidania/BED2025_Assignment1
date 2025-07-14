const express = require("express");
const router = express.Router();
const controller = require("../controllers/savedPlacesController");

router.get("/", controller.getSavedPlaces);
router.post("/", controller.addSavedPlace);
router.delete("/:id", controller.deleteSavedPlace);

module.exports = router;