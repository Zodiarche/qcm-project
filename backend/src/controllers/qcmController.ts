import { Request, Response } from 'express';

import QCM from '../models/QCM.js';
import Result from '../models/Result.js';

interface DetailedResponse {
  question: {
    text: string;
    choices: {
      text: string;
      isCorrect: boolean;
    }[];
  };
  selectedChoice: string;
  isCorrect: boolean;
}

/**
 * Récupère tous les QCMs.
 *
 * @async
 * @function getQcms
 * @param {Request} _request - L'objet de la requête HTTP.
 * @param {Response} response - L'objet de la réponse HTTP.
 * @returns {Promise<Response>} Une promesse qui renvoie la réponse HTTP avec un statut 200 et la liste des QCMs, ou une erreur en cas de problème serveur.
 *
 * @throws {Error} Si une erreur se produit lors de la récupération des QCMs ou si le serveur rencontre une erreur.
 */
export const getQcms = async (_request: Request, response: Response): Promise<Response> => {
  try {
    const qcms = await QCM.find();
    return response.status(200).json(qcms);
  } catch (error) {
    return response.status(500).json({ message: 'Erreur serveur. Impossible de récupérer les QCMs.' });
  }
};

/**
 * Récupère un QCM spécifique par son ID.
 *
 * @async
 * @function getQcmById
 * @param {Request} request - L'objet de la requête HTTP contenant le paramètre `id` dans l'URL.
 * @param {Response} response - L'objet de la réponse HTTP.
 * @returns {Promise<Response>} Une promesse qui renvoie la réponse HTTP avec un statut 200 et les détails du QCM trouvé, ou un message d'erreur si le QCM est introuvable ou si une erreur serveur survient.
 *
 * @throws {Error} Si une erreur se produit lors de la récupération du QCM ou si le serveur rencontre une erreur.
 */
export const getQcmById = async (request: Request, response: Response): Promise<Response> => {
  try {
    const qcm = await QCM.findById(request.params.id);
    if (!qcm) return response.status(404).json({ message: 'QCM introuvable.' });

    return response.status(200).json(qcm);
  } catch (error) {
    return response.status(500).json({ message: 'Erreur serveur. Impossible de récupérer ce QCM.' });
  }
};

/**
 * Soumet les réponses d'un utilisateur à un QCM et calcule le score.
 *
 * @async
 * @function submitQcmForm
 * @param {Request} request - L'objet de la requête HTTP contenant `qcmId`, `userId`, et les réponses de l'utilisateur.
 * @param {Response} response - L'objet de la réponse HTTP.
 * @returns {Promise<Response>} Une promesse qui renvoie la réponse HTTP avec un statut 201 et le résultat du QCM, ou une erreur si le QCM est introuvable ou si une erreur serveur survient.
 *
 * @throws {Error} Si une erreur se produit lors du calcul du score ou si le serveur rencontre une erreur.
 */
export const submitQcmForm = async (request: Request, response: Response): Promise<Response> => {
  try {
    const { qcmId, userId, responses } = request.body;

    const qcm = await QCM.findById(qcmId);
    if (!qcm) return response.status(404).json({ message: 'QCM introuvable' });

    let score = 0;
    let detailedResponses: DetailedResponse[] = [];

    qcm.questions.forEach((question) => {
      const questionId = question._id.toString();
      const selectedChoiceId = responses[questionId];
      const selectedChoice = question.choices.find((choice) => choice._id.toString() === selectedChoiceId);
      const isCorrect = selectedChoice && selectedChoice.isCorrect;

      if (isCorrect) score += 1;

      detailedResponses.push({
        question: {
          text: question.text,
          choices: question.choices.map((choice) => ({
            text: choice.text,
            isCorrect: choice.isCorrect,
          })),
        },
        selectedChoice: selectedChoice ? selectedChoice.text : 'Réponse invalide',
        isCorrect: isCorrect || false,
      });
    });

    const result = new Result({
      user: userId,
      qcm: qcmId,
      title: qcm.title,
      score: score,
      responses: detailedResponses,
    });

    await result.save();

    return response.status(201).json(result);
  } catch (error) {
    return response.status(500).json({ message: 'Erreur serveur. Impossible de soumettre votre QCM.' });
  }
};

/**
 * Crée un nouveau QCM.
 *
 * @async
 * @function createQcm
 * @param {Request} request - L'objet de la requête HTTP contenant le titre, la description et les questions du QCM.
 * @param {Response} response - L'objet de la réponse HTTP.
 * @returns {Promise<Response>} Une promesse qui renvoie la réponse HTTP avec un statut 201 et le QCM créé, ou une erreur en cas de problème serveur.
 *
 * @throws {Error} Si une erreur se produit lors de la création du QCM ou si le serveur rencontre une erreur.
 */
export const createQcm = async (request: Request, response: Response): Promise<Response> => {
  const { title, description, questions } = request.body;
  const createdBy = request.userData?.userId;

  try {
    const newQCM = new QCM({ title, description, questions, createdBy });

    await newQCM.save();
    return response.status(201).json(newQCM);
  } catch (error) {
    return response.status(500).json({ message: 'Erreur serveur. Impossible de créer ce QCM.' });
  }
};

/**
 * Met à jour un QCM existant.
 *
 * @async
 * @function updateQcm
 * @param {Object} request - L'objet de la requête HTTP contenant le titre, la description, les questions du QCM et l'ID du QCM à modifier.
 * @param {Object} response - L'objet de la réponse HTTP.
 * @returns {Promise<Object>} Une promesse qui renvoie la réponse HTTP avec un statut 200 et le QCM mis à jour, ou une erreur en cas de problème serveur.
 *
 * @throws {Error} Si une erreur se produit lors de la mise à jour du QCM ou si le serveur rencontre une erreur.
 */
export const updateQcm = async (request: Request, response: Response): Promise<Response> => {
  const { title, description, questions } = request.body;
  const createdBy = request.userData?.userId;
  const { id } = request.params;

  try {
    const qcm = await QCM.findById(id);
    if (!qcm) return response.status(404).json({ message: 'QCM introuvable.' });

    qcm.title = title || qcm.title;
    qcm.description = description || qcm.description;
    qcm.questions = questions || qcm.questions;
    qcm.createdBy = createdBy || qcm.createdBy;

    await qcm.save();
    return response.status(200).json(qcm);
  } catch (error) {
    return response.status(500).json({ message: 'Erreur serveur. Impossible de modifier ce QCM.' });
  }
};

/**
 * Supprime un QCM spécifique.
 *
 * @async
 * @function deleteQcm
 * @param {Object} request - L'objet de la requête HTTP contenant l'ID du QCM à supprimer.
 * @param {Object} response - L'objet de la réponse HTTP.
 * @returns {Promise<Object>} Une promesse qui renvoie la réponse HTTP avec un statut 200 et un message de succès ou une erreur si le QCM est introuvable ou si une erreur serveur survient.
 *
 * @throws {Error} Si une erreur se produit lors de la suppression du QCM ou si le serveur rencontre une erreur.
 */
export const deleteQcm = async (request: Request, response: Response): Promise<Response> => {
  const { id } = request.params;

  try {
    const qcm = await QCM.findById(id);
    if (!qcm) return response.status(404).json({ message: 'QCM introuvable.' });

    await QCM.deleteOne({ _id: id });
    return response.status(200).json({ message: 'Ce QCM a été supprimé avec succès.' });
  } catch (err) {
    return response.status(500).json({ message: 'Erreur serveur. Impossible de supprimer ce QCM.' });
  }
};
