const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management-dashboard';

    if (!mongoUri) {
        console.error('MongoDB URI not found.');
        process.exit(1);
    }

    try {
        console.log(`Connecting to MongoDB...`);
        const conn = await mongoose.connect(mongoUri);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB; 