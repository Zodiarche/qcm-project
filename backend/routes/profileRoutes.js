import express from 'express';
import { getCompletedQcms } from '../controllers/profileController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route pour récupérer l'historique des QCM complétés par l'utilisateur
router.get('/qcms', isAuthenticated, getCompletedQcms);

export default router;
