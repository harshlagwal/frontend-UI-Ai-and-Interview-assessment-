require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const { router: authRouter } = require('./auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);

// Initialize DB and Start Server
const startServer = async () => {
    try {
        await db.initDb();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error initializing database FULL LOG:', error);
    }
};

startServer();
