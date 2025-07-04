const Joi = require("joi");

// Validation schema for POST/PUT clinic data
const clinicSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  address: Joi.string().min(5).max(255).required(),
  phone: Joi.string().min(3).max(20).required(),
  opening_hours: Joi.string().min(3).max(255).required(),
  map_embed: Joi.string().uri().optional().allow(null, ''),
  region: Joi.string().valid("North", "South", "East", "West", "Central").required()
});

// Middleware to validate body
function validateClinic(req, res, next) {
  const { error } = clinicSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const msg = error.details.map(d => d.message).join(", ");
    return res.status(400).json({ error: msg });
  }
  next();
}

module.exports = { validateClinic };
