import dotenv from 'dotenv'
dotenv.config()

export const ENV = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/mydatabase',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    API_KEY: process.env.API_KEY || 'your_api_key',
    NODE_ENV: process.env.NODE_ENV || 'development',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    SESSION_SECRET: process.env.SESSION_SECRET || 'your_session_secret',

}
