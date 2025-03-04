import express from 'express';

import { register, login, getProfile } from '../controllers/authController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

// Utilisateur non connecté
router.post('/register', register);
router.post('/login', login);

// Utilisateur connecté
router.get('/profile', isAuthenticated, getProfile);

export default router;
