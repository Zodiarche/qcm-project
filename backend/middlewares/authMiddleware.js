import jwt from 'jsonwebtoken';

/**
 * Middleware pour vérifier l'authenticité du token JWT
 */
const authMiddleware = (req, res, next) => {
  try {
    // Récupérer le token dans l'en-tête Authorization
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter l'utilisateur décodé à la requête
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide ou expiré.', error: error.message });
  }
};

export default authMiddleware;
