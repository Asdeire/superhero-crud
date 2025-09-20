const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'superhero_db',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

const initializeDatabase = async () => {
    try {
        const client = await pool.connect();
        console.log('Database connected successfully');

        await client.query(`
      CREATE TABLE IF NOT EXISTS superheroes (
        id SERIAL PRIMARY KEY,
        nickname VARCHAR(255) NOT NULL,
        real_name VARCHAR(255) NOT NULL,
        origin_description TEXT,
        superpowers TEXT,
        catch_phrase TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await client.query(`
      CREATE TABLE IF NOT EXISTS superhero_images (
        id SERIAL PRIMARY KEY,
        superhero_id INTEGER REFERENCES superheroes(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255),
        path VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_superheroes_nickname ON superheroes(nickname)
    `);

        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_superhero_images_superhero_id ON superhero_images(superhero_id)
    `);

        client.release();
        console.log('Database tables initialized');
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
};

module.exports = { pool, initializeDatabase };