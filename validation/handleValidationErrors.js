const { validationResult } = require('express-validator');

// Function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
   
    if (!errors.isEmpty()) {

        return res.status(400).json({
            status: false,
            error: "validation Errors",
            errors: errors.array()
        });
    }
    
    next();
};

module.exports = handleValidationErrors;