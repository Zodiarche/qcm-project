import express from 'express';

import { createQcm, deleteQcm, getQcmById, getQcms, submitQcmForm, updateQcm } from '../controllers/qcmController';
import { isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

// Utilisateur connecté
router.get('/', getQcms);
router.get('/:id', getQcmById);
router.post('/submit', submitQcmForm);

// Administrateur
router.post('/', isAdmin, createQcm);
router.put('/:id', isAdmin, updateQcm);
router.delete('/:id', isAdmin, deleteQcm);

export default router;
