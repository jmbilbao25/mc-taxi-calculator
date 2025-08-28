const Joi = require('joi');

const fareSchema = Joi.object({
  distance: Joi.number().positive().required().messages({
    'number.base': 'Distance must be a number',
    'number.positive': 'Distance must be positive',
    'any.required': 'Distance is required'
  }),
  vehicleType: Joi.string().valid('motorcycle', 'car').default('motorcycle'),
  clientId: Joi.string().default('anonymous'),
  location: Joi.object({
    lat: Joi.number(),
    lng: Joi.number()
  }).optional()
});

const validateFareRequest = (req, res, next) => {
  const { error, value } = fareSchema.validate(req.body, { 
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  req.body = value;
  next();
};

module.exports = validateFareRequest;
