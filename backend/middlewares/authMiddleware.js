import jwt from 'jsonwebtoken';

/**
 * Récupère et vérifie les données utilisateur à partir du token dans la session.
 */
const getUserDataFromToken = (request) => {
  const token = request.headers.authorization.split(' ')[1];
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch (error) {
    return null;
  }
};

/**
 * Vérifie si l'utilisateur est authentifié.
 */
export const isAuthenticated = (request, response, next) => {
  const userData = getUserDataFromToken(request);
  if (!userData) return response.status(401).json({ message: 'Accès refusé, pas de token valide fourni' });

  request.userData = userData;
  next();
};

/**
 * Vérifie si l'utilisateur est administrateur.
 */
export const isAdmin = (request, response, next) => {
  const userData = getUserDataFromToken(request);
  if (!userData) return response.status(401).json({ message: 'Accès refusé, pas de token valide fourni' });
  if (!userData.isAdmin) return response.status(403).json({ message: 'Accès refusé, privilèges insuffisants' });

  request.userData = userData;
  next();
};

/**
 * Vérifie le token JWT.
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
