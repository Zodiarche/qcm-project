import { Request, Response } from 'express';

import Result from '../models/Result.js';

export const getCompletedQcms = async (request: Request, response: Response): Promise<Response> => {
  try {
    const userId = request.userData?.userId;
    if (!userId) return response.status(400).json({ message: 'Utilisateur non authentifié' });

    const completedQcms = await Result.find({ user: userId }).sort({ completedAt: -1 });
    if (!completedQcms) return response.status(400).json({ message: "Aucun QCM n'a été complété par cet utilisateur." });

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

    return response.status(200).json(formattedQcms);
  } catch (error) {
    return response.status(500).json({ message: 'Erreur serveur' });
  }
};
