import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import './config/redis';
import './queues/githubEventWorker';
import authRoutes from './routes/authRoutes';
import sprintRoutes from './routes/sprintRoutes';
import taskRoutes from './routes/taskRoutes';
import webhookRoutes from './routes/webhookRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import aiRoutes from './routes/aiRoutes';

connectDB();

const app = express();

app.use(cors());

// IMPORTANT: webhook route needs raw body (for signature verification)
// so it must be registered BEFORE express.json()
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// Regular JSON parsing for all other routes
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});