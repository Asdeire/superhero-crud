require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { initializeDatabase } = require('./src/config/database');
const superheroRoutes = require('./src/routes/superheroRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const { createUploadsDir } = require('./src/utils/fileHelper');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/superheroes', superheroRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const startServer = async () => {
    try {
        await createUploadsDir();
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;