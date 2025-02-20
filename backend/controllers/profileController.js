import Result from '../models/Result.js';

export const getCompletedQcms = async (req, res) => {
  try {
    const userId = req.userData.userId;

    if (!userId) {
      return res.status(400).json({ message: 'Utilisateur non authentifié' });
    }

    const completedQcms = await Result.find({ user: userId }).populate('qcm', 'title').sort({ completedAt: -1 });

    // Formater la réponse
    const formattedQcms = completedQcms.map((completedQcm) => ({
      id: completedQcm._id,
      qcm: completedQcm.qcm._id,
      title: completedQcm.title,
      score: completedQcm.score,
      totalQuestions: completedQcm.responses.length,
      date: completedQcm.completedAt.toISOString(),
      responses: completedQcm.responses.map((response) => ({
        question: response.question.text,
        selectedChoice: response.selectedChoice,
        isCorrect: response.isCorrect,
      })),
    }));

    res.status(200).json(formattedQcms);
  } catch (error) {
    console.error('Erreur lors de la récupération des QCM complétés:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
