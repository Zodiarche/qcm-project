import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';

/**
 * Inscription d'un nouvel utilisateur.
 *
 * @async
 * @function register
 * @param {Request} request - L'objet de la requête HTTP.
 * @param {Response} response - L'objet de la réponse HTTP.
 * @returns {Promise<Response>} Une promesse qui renvoie la réponse HTTP avec un statut 201 et un message de succès, ou une erreur si l'inscription échoue.
 *
 * @throws {Error} Si une erreur se produit lors de l'inscription ou si le serveur rencontre une erreur.
 */
export const register = async (request: Request, response: Response): Promise<Response> => {
  try {
    const { lastname, firstname, email, password } = request.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ lastname, firstname, email, password: hashedPassword });
    await newUser.save();

    return response.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return response.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
    } else {
      return response.status(500).json({ message: "Erreur inconnue lors de l'inscription" });
    }
  }
};

/**
 * Connexion d'un utilisateur.
 *
 * @async
 * @function login
 * @param {Request} request - L'objet de la requête HTTP.
 * @param {Response} response - L'objet de la réponse HTTP.
 * @returns {Promise<Response>} Une promesse qui renvoie la réponse HTTP avec un token JWT en cas de succès, ou un message d'erreur si les identifiants sont incorrects.
 *
 * @throws {Error} Si une erreur se produit lors de la connexion ou si le serveur rencontre une erreur.
 */
export const login = async (request: Request, response: Response): Promise<Response> => {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    if (!user) return response.status(400).json({ message: 'Identifiants incorrects' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return response.status(400).json({ message: 'Identifiants incorrects' });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET est indéfini. Vérifiez votre fichier .env');
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '24h' });

    return response.json({ message: 'Connexion réussie', token, userId: user._id });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return response.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    } else {
      return response.status(500).json({ message: 'Erreur inconnue lors de la connexion' });
    }
  }
};

/**
 * Récupération des informations du profil de l'utilisateur connecté.
 *
 * @async
 * @function getProfile
 * @param {Request} request - L'objet de la requête HTTP.
 * @param {Response} response - L'objet de la réponse HTTP.
 * @returns {Promise<Response>} Une promesse qui renvoie la réponse HTTP contenant les informations de l'utilisateur (hors mot de passe), ou un message d'erreur si l'utilisateur est introuvable.
 *
 * @throws {Error} Si une erreur se produit lors de la récupération du profil ou si le serveur rencontre une erreur.
 */
export const getProfile = async (request: Request, response: Response): Promise<Response> => {
  try {
    const user = await User.findById(request.userData.userId).select('-password');
    if (!user) return response.status(404).json({ message: 'Utilisateur non trouvé.' });

    return response.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return response.status(500).json({ message: 'Erreur lors de la récupération du profil', error: error.message });
    } else {
      return response.status(500).json({ message: 'Erreur inconnue lors de la récupération du profil' });
    }
  }
};
