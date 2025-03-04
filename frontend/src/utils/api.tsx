import { LoginInputs } from '@/pages/Login';
import { QcmResult } from '@/pages/Profile';
import { RegisterInputs } from '@/pages/Register';

export const loginUser = async (data: LoginInputs) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Identifiants incorrects');
  }

  return responseData;
};

export const registerUser = async (data: RegisterInputs) => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Une erreur s'est produite lors de l'inscription");
  }

  return responseData;
};

export const fetchProfile = async (token: string | null) => {
  if (!token) throw new Error('Aucun token disponible');

  const response = await fetch('http://localhost:5000/api/auth/profile', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token invalide ou expiré');
  }

  return response.json();
};

export const fetchQcms = async () => {
  const response = await fetch('http://localhost:5000/api/qcms', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  });

  if (!response.ok) throw new Error('Erreur lors du chargement des QCMs');
  return response.json();
};

export const fetchQcmById = async (id: string) => {
  const response = await fetch(`http://localhost:5000/api/qcms/${id}`);

  if (!response.ok) throw new Error('Erreur lors du chargement du QCM');
  return response.json();
};

export const submitQcmResponse = async (data: { qcmId: string; responses: Record<string, string> }) => {
  const response = await fetch('http://localhost:5000/api/qcms/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, userId: sessionStorage.getItem('userId') }),
  });

  if (!response.ok) throw new Error('Erreur lors de la soumission des réponses');
  return response.json();
};

export const fetchUserQcmsResult = async (): Promise<QcmResult[]> => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Utilisateur non authentifié');
  }

  const response = await fetch('http://localhost:5000/api/profile/qcms', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Erreur serveur: ${response.status}`);
  }

  return response.json();
};
