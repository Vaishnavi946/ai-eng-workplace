import { Redis } from 'ioredis';

const redisUrl = process.env.REDIS_URL as string;

export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

redisConnection.on('connect', () => {
  console.log('Redis connected successfully');
});

redisConnection.on('error', (err) => {
  console.error('Redis connection error:', err);
});