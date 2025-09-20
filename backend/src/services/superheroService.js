const Superhero = require('../models/Superhero');
const { pool } = require('../config/database');
const { deleteFile } = require('../utils/fileHelper');

class SuperheroService {
    static async getAllSuperheroes(page = 1, limit = 5) {
        const offset = (page - 1) * limit;
        const result = await Superhero.findAll(limit, offset);

        return {
            data: result.data,
            pagination: {
                page,
                limit,
                totalCount: result.totalCount,
                totalPages: Math.ceil(result.totalCount / limit)
            }
        };
    }

    static async getSuperheroById(id) {
        const superhero = await Superhero.findById(id);
        if (!superhero) {
            throw new Error('Superhero not found');
        }
        return superhero;
    }

    static async createSuperhero(superheroData, files = []) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Create superhero
            const superhero = await Superhero.create(superheroData);

            // Add images if provided
            const images = [];
            for (const file of files) {
                const image = await Superhero.addImage(superhero.id, {
                    filename: file.filename,
                    original_name: file.originalname,
                    path: file.path
                });
                images.push(image);
            }

            await client.query('COMMIT');

            return {
                ...superhero,
                images
            };
        } catch (error) {
            await client.query('ROLLBACK');

            // Clean up uploaded files on error
            for (const file of files) {
                await deleteFile(file.path);
            }

            throw error;
        } finally {
            client.release();
        }
    }

    static async updateSuperhero(id, superheroData, files = []) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Check if superhero exists
            const existingSuperhero = await Superhero.findById(id);
            if (!existingSuperhero) {
                throw new Error('Superhero not found');
            }

            // Update superhero
            const updatedSuperhero = await Superhero.update(id, superheroData);

            // Add new images if provided
            const newImages = [];
            for (const file of files) {
                const image = await Superhero.addImage(id, {
                    filename: file.filename,
                    original_name: file.originalname,
                    path: file.path
                });
                newImages.push(image);
            }

            await client.query('COMMIT');

            // Get all images for response
            const allImages = await Superhero.getImages(id);

            return {
                ...updatedSuperhero,
                images: allImages
            };
        } catch (error) {
            await client.query('ROLLBACK');

            // Clean up uploaded files on error
            for (const file of files) {
                await deleteFile(file.path);
            }

            throw error;
        } finally {
            client.release();
        }
    }

    static async deleteSuperhero(id) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Get images to delete files from filesystem
            const images = await Superhero.getImages(id);

            // Delete superhero (images will be deleted by CASCADE)
            const deletedSuperhero = await Superhero.delete(id);
            if (!deletedSuperhero) {
                throw new Error('Superhero not found');
            }

            await client.query('COMMIT');

            // Delete image files from filesystem
            for (const image of images) {
                await deleteFile(image.path);
            }

            return deletedSuperhero;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async deleteSuperheroImage(superheroId, imageId) {
        // Check if superhero exists
        const superhero = await Superhero.findById(superheroId);
        if (!superhero) {
            throw new Error('Superhero not found');
        }

        // Remove image from database
        const deletedImage = await Superhero.removeImage(superheroId, imageId);
        if (!deletedImage) {
            throw new Error('Image not found');
        }

        // Delete image file from filesystem
        await deleteFile(deletedImage.path);

        return deletedImage;
    }
}

module.exports = SuperheroService;