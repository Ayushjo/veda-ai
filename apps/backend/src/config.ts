import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  mongoUri: process.env.MONGO_DB_URI || process.env.MONGODB_URI || '',
  dbName: process.env.DB_NAME || 'VedAI',
  redisUrl: process.env.REDIS_URL || '',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Validate required env vars on startup
const required = ['MONGO_DB_URI', 'REDIS_URL', 'ANTHROPIC_API_KEY'];
for (const key of required) {
  if (!process.env[key]) {
    console.warn(`Warning: ${key} is not set`);
  }
}
