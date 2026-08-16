import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { askQuestion } from '../controllers/aiController';

const router = express.Router();

router.post('/ask', protect, askQuestion);

export default router;