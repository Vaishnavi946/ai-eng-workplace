import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const githubEventQueue = new Queue('github-events', {
  connection: redisConnection,
});