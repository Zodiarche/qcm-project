import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route d'inscription
router.post('/register', register);

// Route de connexion
router.post('/login', login);

// Route pour récupérer les informations du profil
router.get('/profile', isAuthenticated, getProfile);

export default router;
