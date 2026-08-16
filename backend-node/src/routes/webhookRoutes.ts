import express from 'express';
import { handleGitHubWebhook, getReviewQueue } from '../controllers/webhookController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/github', handleGitHubWebhook);
router.get('/review-queue', protect, getReviewQueue);

export default router;