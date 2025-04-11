require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3001,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app',
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOptions: {
        origin: process.env.NODE_ENV === 'production' 
            ? ['https://your-production-domain.com']
            : ['http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
}; 