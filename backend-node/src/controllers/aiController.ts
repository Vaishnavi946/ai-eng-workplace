import { Response } from 'express';
import axios from 'axios';
import { AuthRequest } from '../middleware/authMiddleware';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export const askQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const response = await axios.post(`${AI_SERVICE_URL}/query/ask`, {
      question,
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('AI service error:', error.message);
    res.status(500).json({ message: 'Failed to get answer from AI service' });
  }
};