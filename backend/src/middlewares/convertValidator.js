const Joi = require('joi');

// Validation schema for unit conversion requests.
// Ensures incoming data is well-formed before reaching the controller.
const convertSchema = Joi.object({
    value: Joi.number().required().label('Value'),
    from: Joi.string().required().label('From unit'),
    to: Joi.string().required().label('To unit'),
    category: Joi.string().optional().label('Category'),
    save: Joi.boolean().optional().default(true)
});

/**
 * Middleware to validate conversion requests.
 * Attaches sanitized and validated data to the request object.
 */
function validateConvert(req, res, next) {
    const { error, value } = convertSchema.validate(req.body);

    // Stop request early if validation fails
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    // Store validated payload for downstream handlers
    req.validatedBody = value;
    next();
}

module.exports = validateConvert;
