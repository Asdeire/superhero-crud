const validateSuperhero = (req, res, next) => {
    const { nickname, real_name } = req.body;
    const errors = [];

    // Required fields validation
    if (!nickname || nickname.trim() === '') {
        errors.push('Nickname is required');
    }

    if (!real_name || real_name.trim() === '') {
        errors.push('Real name is required');
    }

    // Length validation
    if (nickname && nickname.length > 255) {
        errors.push('Nickname must be less than 255 characters');
    }

    if (real_name && real_name.length > 255) {
        errors.push('Real name must be less than 255 characters');
    }

    if (req.body.catch_phrase && req.body.catch_phrase.length > 500) {
        errors.push('Catch phrase must be less than 500 characters');
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors
        });
    }

    // Sanitize input data
    req.body.nickname = nickname.trim();
    req.body.real_name = real_name.trim();

    if (req.body.origin_description) {
        req.body.origin_description = req.body.origin_description.trim();
    }

    if (req.body.superpowers) {
        req.body.superpowers = req.body.superpowers.trim();
    }

    if (req.body.catch_phrase) {
        req.body.catch_phrase = req.body.catch_phrase.trim();
    }

    next();
};

const validatePagination = (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (page && (page < 1 || isNaN(page))) {
        return res.status(400).json({
            error: 'Page must be a positive number'
        });
    }

    if (limit && (limit < 1 || limit > 50 || isNaN(limit))) {
        return res.status(400).json({
            error: 'Limit must be a number between 1 and 50'
        });
    }

    next();
};

module.exports = {
    validateSuperhero,
    validatePagination
};