import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes';
import emailRoutes from './routes/emailRoutes';
import profileRoutes from './routes/profileRoutes';
import qcmRoutes from './routes/qcmRoutes';
import { isAuthenticated } from './middlewares/authMiddleware';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB connecté'))
  .catch((error) => console.error('Erreur de connexion MongoDB:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mail', emailRoutes);
app.use('/api/qcms', isAuthenticated, qcmRoutes);
app.use('/api/profile', isAuthenticated, profileRoutes);

app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
