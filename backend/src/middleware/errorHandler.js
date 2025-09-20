const multer = require('multer');

const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);

    // Multer errors
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large. Maximum size is 5MB'
            });
        }

        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                error: 'Too many files. Maximum is 10 files'
            });
        }

        return res.status(400).json({
            error: 'File upload error',
            details: error.message
        });
    }

    // File type validation error
    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({
            error: 'Only image files are allowed'
        });
    }

    // Database connection errors
    if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({
            error: 'Database connection failed'
        });
    }

    // PostgreSQL errors
    if (error.code) {
        switch (error.code) {
            case '23505': // Unique violation
                return res.status(409).json({
                    error: 'Data already exists'
                });
            case '23503': // Foreign key violation
                return res.status(400).json({
                    error: 'Referenced data does not exist'
                });
            case '23502': // Not null violation
                return res.status(400).json({
                    error: 'Required field is missing'
                });
            case '22001': // String data right truncation
                return res.status(400).json({
                    error: 'Data too long for field'
                });
        }
    }

    // Validation errors
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation failed',
            details: error.message
        });
    }

    // Custom application errors
    if (error.message === 'Superhero not found') {
        return res.status(404).json({
            error: error.message
        });
    }

    // Default server error
    res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : error.message
    });
};

module.exports = errorHandler;