const express = require('express');
const SuperheroController = require('../controllers/superheroController');
const { upload } = require('../config/multer');
const { validateSuperhero } = require('../middleware/validation');

const router = express.Router();

// GET /api/superheroes - List all superheroes with pagination
router.get('/', SuperheroController.getAllSuperheroes);

// GET /api/superheroes/:id - Get superhero details
router.get('/:id', SuperheroController.getSuperheroById);

// POST /api/superheroes - Create new superhero
router.post('/',
    upload.array('images', 10),
    validateSuperhero,
    SuperheroController.createSuperhero
);

// PUT /api/superheroes/:id - Update superhero
router.put('/:id',
    upload.array('images', 10),
    validateSuperhero,
    SuperheroController.updateSuperhero
);

// DELETE /api/superheroes/:id - Delete superhero
router.delete('/:id', SuperheroController.deleteSuperhero);

// DELETE /api/superheroes/:id/images/:imageId - Delete specific image
router.delete('/:id/images/:imageId', SuperheroController.deleteSuperheroImage);

module.exports = router;