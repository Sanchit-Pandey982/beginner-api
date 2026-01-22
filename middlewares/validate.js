const Joi = require('joi'); // Import Joi for validation

// --- 1. Inline Middleware for REGISTER ---
const validateRegister = (req, res, next) => {
    // Define the rules specifically for registration inside the function
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(), // Enforce strength
        username: Joi.string().min(3).optional()
    });

    // Check the body
    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    
    next(); // Pass to controller
};

// --- 2. Inline Middleware for LOGIN ---
const validateLogin = (req, res, next) => {
    // Define specific rules for login
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required() // No need for min(6) here, just check if it exists
    });

    // Check the body
    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    
    next();
};

module.exports = {
    validateRegister,
    validateLogin
};