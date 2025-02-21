import express from 'express';
import QCM from '../models/QCM.js';
import Result from '../models/Result.js';
import { isAdmin } from '../middlewares/authMiddleware.js';

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

router.get('/:id', async (req, res) => {
  try {
    const qcm = await QCM.findById(req.params.id);
    if (!qcm) return res.status(404).json({ message: 'QCM introuvable' });

    res.status(200).json(qcm);
  } catch (error) {
    console.error('Erreur lors de la récupération du QCM:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/submit', async (req, res) => {
  try {
    const { qcmId, userId, responses } = req.body;

    // Vérification si le QCM existe
    const qcm = await QCM.findById(qcmId);
    if (!qcm) return res.status(404).json({ message: 'QCM non trouvé' });

    let score = 0;
    let detailedResponses = [];

    // Parcourir les questions du QCM et comparer avec les réponses de l'utilisateur
    qcm.questions.forEach((question) => {
      const questionId = question._id.toString();
      const selectedChoiceId = responses[questionId];
      const selectedChoice = question.choices.find((choice) => choice._id.toString() === selectedChoiceId);
      const isCorrect = selectedChoice && selectedChoice.isCorrect;

      if (isCorrect) score += 1;

      // Stocker la réponse pour la sauvegarde
      detailedResponses.push({
        question: {
          text: question.text,
          choices: question.choices.map((choice) => ({
            text: choice.text,
            isCorrect: choice.isCorrect,
          })),
        },
        selectedChoice: selectedChoice ? selectedChoice.text : 'Réponse invalide',
        isCorrect: isCorrect,
      });
    });

    // Création du résultat
    const result = new Result({
      user: userId,
      qcm: qcmId,
      title: qcm.title,
      score: score,
      responses: detailedResponses,
    });

    // Sauvegarde en base de données
    await result.save();

    res.status(201).json(result);
  } catch (error) {
    console.error('Erreur lors de l’enregistrement du résultat:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Ajouter un QCM
router.post('/', isAdmin, async (req, res) => {
  const { title, description, questions } = req.body;
  const createdBy = req.userData.userId;

  try {
    const newQCM = new QCM({ title, description, questions, createdBy });
    await newQCM.save();
    res.status(201).json(newQCM);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du QCM', error: err.message });
  }
});

// Modifier un QCM
router.put('/:id', isAdmin, async (req, res) => {
  const { title, description, questions } = req.body;
  const { id } = req.params;
  const createdBy = req.userData.userId;

  try {
    const qcm = await QCM.findById(id);

    if (!qcm) {
      return res.status(404).json({ message: 'QCM introuvable' });
    }

    qcm.title = title || qcm.title;
    qcm.description = description || qcm.description;
    qcm.questions = questions || qcm.questions;
    qcm.createdBy = createdBy || qcm.createdBy;

    await qcm.save();
    res.status(200).json(qcm);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification du QCM', error: err.message });
  }
});

router.delete('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  console.log(id);

  try {
    const qcm = await QCM.findById(id);

    if (!qcm) {
      return res.status(404).json({ message: 'QCM introuvable' });
    }

    await QCM.deleteOne({ _id: id });
    res.status(200).json({ message: 'QCM supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du QCM', error: err.message });
  }
});

export default router;
