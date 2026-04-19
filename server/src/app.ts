import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import syncRoutes from './routes/sync';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sync', syncRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
