const express = require("express");
const router = express.Router();
const { getDirections, createDirection, updateDirection, deleteDirection } = require("../controllers/directionsController");
const { validateDirection, validateDirectionId } = require("../middlewares/validateDirection");

router.get("/:clinicId", getDirections);
router.post("/", validateDirection, createDirection);
router.put("/:clinicId", validateDirection, updateDirection);
router.delete("/:id", validateDirectionId, deleteDirection);

module.exports = router;
