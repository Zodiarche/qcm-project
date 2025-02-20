import express from 'express';
import QCM from '../models/QCM.js';

const router = express.Router();

// Route pour récupérer tous les QCMs
router.get('/', async (_req, res) => {
  try {
    const qcms = await QCM.find().populate('createdBy', 'name email');
    res.status(200).json(qcms);
  } catch (error) {
    console.error('Erreur lors de la récupération des QCMs:', error);
    res.status(500).json({ message: 'Erreur serveur. Impossible de récupérer les QCMs.' });
  }
});

export default router;
