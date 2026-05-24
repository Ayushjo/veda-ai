import { Redis } from 'ioredis';
import { config } from '../config.js';

const redisClient = new Redis(config.redisUrl || 'redis://localhost:6379', {
  // BullMQ requires maxRetriesPerRequest: null for blocking commands (Worker)
  maxRetriesPerRequest: null,
  // Prevent crashing the process on connection failure
  lazyConnect: true,
  enableOfflineQueue: false,
  retryStrategy: (times: number) => {
    if (times > 5) return null; // stop retrying after 5 attempts
    return Math.min(times * 500, 2000);
  },
});

redisClient.on('error', (err: Error) => {
  console.error('Redis error:', err.message);
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

// Attempt connection (lazyConnect requires explicit connect call)
if (config.redisUrl) {
  redisClient.connect().catch((err: Error) => {
    console.error('Redis connect failed:', err.message);
  });
}

export async function setCache(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  try {
    await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (err) {
    console.error('setCache error:', err);
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (err) {
    console.error('getCache error:', err);
    return null;
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error('deleteCache error:', err);
  }
}

export default redisClient;
