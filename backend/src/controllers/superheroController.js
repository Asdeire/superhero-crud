const SuperheroService = require('../services/superheroService');

class SuperheroController {
    // Get a paginated list of superheroes
    static async getAllSuperheroes(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;

            const result = await SuperheroService.getAllSuperheroes(page, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // Get a superhero by ID
    static async getSuperheroById(req, res, next) {
        try {
            const { id } = req.params;
            const superhero = await SuperheroService.getSuperheroById(id);
            res.json(superhero);
        } catch (error) {
            if (error.message === 'Superhero not found') {
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    }

    // Create a new superhero (with optional images)
    static async createSuperhero(req, res, next) {
        try {
            const superheroData = req.body;
            const files = req.files || [];

            const superhero = await SuperheroService.createSuperhero(superheroData, files);
            res.status(201).json(superhero);
        } catch (error) {
            next(error);
        }
    }

    // Update superhero data and images
    static async updateSuperhero(req, res, next) {
        try {
            const { id } = req.params;
            const superheroData = req.body;
            const files = req.files || [];

            const superhero = await SuperheroService.updateSuperhero(id, superheroData, files);
            res.json(superhero);
        } catch (error) {
            if (error.message === 'Superhero not found') {
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    }

    // Delete a superhero by ID
    static async deleteSuperhero(req, res, next) {
        try {
            const { id } = req.params;
            await SuperheroService.deleteSuperhero(id);
            res.json({ message: 'Superhero deleted successfully' });
        } catch (error) {
            if (error.message === 'Superhero not found') {
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    }

    // Delete a specific image from a superhero
    static async deleteSuperheroImage(req, res, next) {
        try {
            const { id, imageId } = req.params;
            await SuperheroService.deleteSuperheroImage(id, imageId);
            res.json({ message: 'Image deleted successfully' });
        } catch (error) {
            if (error.message === 'Superhero not found' || error.message === 'Image not found') {
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    }
}

module.exports = SuperheroController;