const { pool } = require('../config/database');

class Superhero {
    static async findAll(limit = 5, offset = 0) {
        const countQuery = 'SELECT COUNT(*) FROM superheroes';
        const countResult = await pool.query(countQuery);
        const totalCount = parseInt(countResult.rows[0].count);

        const query = `
      SELECT 
        s.id, 
        s.nickname, 
        s.real_name,
        s.created_at,
        (SELECT si.path FROM superhero_images si WHERE si.superhero_id = s.id LIMIT 1) as image_path
      FROM superheroes s
      ORDER BY s.created_at DESC
      LIMIT $1 OFFSET $2
    `;

        const result = await pool.query(query, [limit, offset]);

        return {
            data: result.rows,
            totalCount
        };
    }

    static async findById(id) {
        const superheroQuery = 'SELECT * FROM superheroes WHERE id = $1';
        const superheroResult = await pool.query(superheroQuery, [id]);

        if (superheroResult.rows.length === 0) {
            return null;
        }

        const imagesQuery = 'SELECT * FROM superhero_images WHERE superhero_id = $1 ORDER BY created_at';
        const imagesResult = await pool.query(imagesQuery, [id]);

        return {
            ...superheroResult.rows[0],
            images: imagesResult.rows
        };
    }

    static async create(superheroData) {
        const { nickname, real_name, origin_description, superpowers, catch_phrase } = superheroData;

        const query = `
      INSERT INTO superheroes (nickname, real_name, origin_description, superpowers, catch_phrase) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;

        const result = await pool.query(query, [
            nickname,
            real_name,
            origin_description,
            superpowers,
            catch_phrase
        ]);

        return result.rows[0];
    }

    static async update(id, superheroData) {
        const { nickname, real_name, origin_description, superpowers, catch_phrase } = superheroData;

        const query = `
      UPDATE superheroes 
      SET nickname = $1, real_name = $2, origin_description = $3, superpowers = $4, catch_phrase = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

        const result = await pool.query(query, [
            nickname,
            real_name,
            origin_description,
            superpowers,
            catch_phrase,
            id
        ]);

        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM superheroes WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async addImage(superheroId, imageData) {
        const { filename, original_name, path } = imageData;

        const query = `
      INSERT INTO superhero_images (superhero_id, filename, original_name, path) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;

        const result = await pool.query(query, [superheroId, filename, original_name, path]);
        return result.rows[0];
    }

    static async removeImage(superheroId, imageId) {
        const query = `
      DELETE FROM superhero_images 
      WHERE id = $1 AND superhero_id = $2 
      RETURNING *
    `;

        const result = await pool.query(query, [imageId, superheroId]);
        return result.rows[0];
    }

    static async getImages(superheroId) {
        const query = 'SELECT * FROM superhero_images WHERE superhero_id = $1 ORDER BY created_at';
        const result = await pool.query(query, [superheroId]);
        return result.rows;
    }
}

module.exports = Superhero;