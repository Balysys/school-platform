import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth';
import elevesRoutes from './routes/eleves';
import notesRoutes from './routes/notes';
import classesRoutes from './routes/classes';
import matieresRoutes from './routes/matieres';
import periodesRoutes from './routes/periodes';
import utilisateursRoutes from './routes/utilisateurs';

const app = express();
const PORT: number = parseInt(process.env.PORT || '3001', 10);

// Simple CORS - Allow all origins (development only)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/eleves', elevesRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/matieres', matieresRoutes);
app.use('/api/periodes', periodesRoutes);
app.use('/api/utilisateurs', utilisateursRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'School Platform API' });
});

// Health check at root too (for backward compatibility)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server - listen on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log('CORS enabled for all origins (development mode)');
});

export default app;
