import express from 'express';

import { sendEmail } from '../controllers/emailController';

const router = express.Router();

// Utilisateur non connecté
router.post('/send-email', sendEmail);

export default router;
