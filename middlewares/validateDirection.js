const Joi = require("joi");

// POST/PUT Schema
const directionSchema = Joi.object({
  clinic_id: Joi.number().integer().positive().required(),
  step_number: Joi.number().integer().positive().required(),
  instruction: Joi.string().min(5).max(255).required(),
  icon_path: Joi.string().allow('', null).optional()
});

function validateDirection(req, res, next) {
  const { error } = directionSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      error: error.details.map((d) => d.message).join(", ")
    });
  }

  next();
}

function validateDirectionId(req, res, next) {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid direction ID" });
  }
  next();
}

module.exports = {
  validateDirection,
  validateDirectionId
};
