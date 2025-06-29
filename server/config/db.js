const mongoose = require('mongoose');

const ATLAS_MONGO_URI = 'mongodb+srv://ronilborah:ichigo@tms.hzzmrui.mongodb.net/?retryWrites=true&w=majority&appName=TMS';

const connectDB = async () => {
    const mongoUri = ATLAS_MONGO_URI;

    if (!mongoUri) {
        console.error('MongoDB URI not found.');
        process.exit(1);
    }

    try {
        console.log(`Connecting to Atlas MongoDB...`);
        const conn = await mongoose.connect(mongoUri);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB; 