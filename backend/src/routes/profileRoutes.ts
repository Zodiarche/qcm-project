import express from 'express';

import { getCompletedQcms } from '../controllers/profileController';

const router = express.Router();

// Utilisateur connecté
router.get('/qcms', getCompletedQcms);

export default router;
