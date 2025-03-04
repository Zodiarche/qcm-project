import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const userDataSchema = z.object({
  userId: z.string(),
  isAdmin: z.boolean(),
});

type UserData = z.infer<typeof userDataSchema>;

/**
 * Récupère et vérifie les données utilisateur à partir du token dans la session.
 * @param request L'objet de la requête HTTP.
 * @returns Les données utilisateur extraites du token ou null si invalide.
 */
const getUserDataFromToken = (request: Request): UserData | null => {
  const token = request.headers.authorization?.split(' ')[1];
  if (!token) return null;

  try {
    const verifiedData = verifyToken(token);

    const parsedData = userDataSchema.safeParse(verifiedData);
    if (!parsedData.success) {
      console.error("Erreur de validation du token:", parsedData.error);
      return null;
    }

    return parsedData.data;
  } catch (error) {
    return null;
  }
};

/**
 * Vérifie si l'utilisateur est authentifié.
 * @param request L'objet de la requête HTTP.
 * @param response L'objet de la réponse HTTP.
 * @param next La fonction next pour passer au middleware suivant.
 */
export const isAuthenticated = (request: Request, response: Response, next: NextFunction): void => {
  const userData = getUserDataFromToken(request);
  if (!userData) {
    response.status(401).json({ message: 'Accès refusé, pas de token valide fourni' });
    return;
  }

  request.userData = userData;
  next();
};

/**
 * Vérifie si l'utilisateur est administrateur.
 * @param request L'objet de la requête HTTP.
 * @param response L'objet de la réponse HTTP.
 * @param next La fonction next pour passer au middleware suivant.
 */
export const isAdmin = (request: Request, response: Response, next: NextFunction): void => {
  const userData = getUserDataFromToken(request);
  if (!userData) {
    response.status(401).json({ message: 'Accès refusé, pas de token valide fourni' });
    return;
  }

  if (!userData.isAdmin) {
    response.status(403).json({ message: 'Accès refusé, privilèges insuffisants' });
    return;
  }

  request.userData = userData;
  next();
};

/**
 * Vérifie le token JWT.
 * @param token Le token JWT à vérifier.
 * @returns Les données utilisateur extraites du token.
 * @throws Error si le token est invalide.
 */
const verifyToken = (token: string): UserData => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as UserData;
};
