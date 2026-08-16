import { Request, Response } from 'express';
import crypto from 'crypto';
import GitHubEvent from '../models/GitHubEvent';
import { githubEventQueue } from '../queues/githubEventQueue';

// This checks that the request truly came from GitHub (not faked)
const verifySignature = (payload: Buffer, signature: string | undefined): boolean => {
  if (!signature) return false;

  const secret = process.env.GITHUB_WEBHOOK_SECRET as string;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
};

export const handleGitHubWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-hub-signature-256'] as string;
    const eventType = req.headers['x-github-event'] as string;
    const deliveryId = req.headers['x-github-delivery'] as string;

    // req.body here is the raw Buffer (we'll configure this in index.ts)
    const isValid = verifySignature(req.body, signature);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const payload = JSON.parse(req.body.toString());

    // Avoid saving the same event twice
    const existing = await GitHubEvent.findOne({ deliveryId });
    if (existing) {
      return res.status(200).json({ message: 'Event already processed' });
    }

    const event = await GitHubEvent.create({
      eventType,
      deliveryId,
      repository: payload.repository?.full_name || 'unknown',
      action: payload.action,
      prNumber: payload.pull_request?.number,
      prTitle: payload.pull_request?.title,
      prUrl: payload.pull_request?.html_url,
      prAuthor: payload.pull_request?.user?.login,
      payload,
    });

    console.log(`GitHub event received: ${eventType} - ${payload.action || ''}`);

    // Add this event to the background queue for processing
    if (eventType === 'pull_request') {
      await githubEventQueue.add('process-pr-event', { eventId: event._id });
    }

    res.status(200).json({ message: 'Event received', eventId: event._id });
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

// GET the prioritized review queue
export const getReviewQueue = async (req: Request, res: Response) => {
  try {
    const events = await GitHubEvent.find({
      eventType: 'pull_request',
      action: { $in: ['opened', 'reopened', 'synchronize', 'review_requested'] },
    })
      .sort({ priorityScore: -1 }) // highest priority first
      .limit(50);

    // Only show PRs that are currently "open" (not closed/merged)
    const openPRs = events.filter(
      (e) => e.payload?.pull_request?.state === 'open'
    );

    res.status(200).json(openPRs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};