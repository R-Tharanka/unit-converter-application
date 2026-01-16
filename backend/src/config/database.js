const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using Mongoose.
 * The connection string is read from environment variables.
 */
async function connectDB() {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
        console.error('MONGO_URI is not defined in environment variables');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
