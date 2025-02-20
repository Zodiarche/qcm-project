import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import qcmRoutes from './routes/qcmRoutes.js';

dotenv.config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur de connexion MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mail', emailRoutes);
app.use('/api/qcms', qcmRoutes);
app.use('/api/profile', profileRoutes);

app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
