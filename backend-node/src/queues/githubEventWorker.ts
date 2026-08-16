import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import GitHubEvent from '../models/GitHubEvent';

// Simple scoring logic for now - we'll make this smarter later
const calculatePriorityScore = (event: any): number => {
  let score = 0;

  // Older PRs are more urgent (waiting longer = higher priority)
  if (event.payload?.pull_request?.created_at) {
    const createdAt = new Date(event.payload.pull_request.created_at);
    const hoursOld = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
    score += Math.min(hoursOld, 100); // cap at 100 points for age
  }

  // More changed files = more important to review carefully
  const changedFiles = event.payload?.pull_request?.changed_files || 0;
  score += changedFiles * 2;

  // Draft PRs are lower priority (not ready for review yet)
  if (event.payload?.pull_request?.draft) {
    score -= 50;
  }

  return Math.round(score);
};

// Check if PR hasn't been updated in more than 3 days = "stale"
const checkIsStale = (event: any): boolean => {
  if (!event.payload?.pull_request?.updated_at) return false;
  const updatedAt = new Date(event.payload.pull_request.updated_at);
  const daysSinceUpdate = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceUpdate > 3;
};

export const githubEventWorker = new Worker(
  'github-events',
  async (job) => {
    const { eventId } = job.data;

    const event = await GitHubEvent.findById(eventId);
    if (!event) {
      console.log(`Event ${eventId} not found, skipping`);
      return;
    }

    // Only score pull_request events (not pings etc.)
    if (event.eventType === 'pull_request') {
      const priorityScore = calculatePriorityScore(event);
      const isStale = checkIsStale(event);

      event.priorityScore = priorityScore;
      event.isStale = isStale;
      await event.save();

      console.log(
        `Processed PR #${event.prNumber}: priority=${priorityScore}, stale=${isStale}`
      );
    }
  },
  { connection: redisConnection }
);

githubEventWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

githubEventWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});