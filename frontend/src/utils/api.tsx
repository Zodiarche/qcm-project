import { LoginInputs } from '@/pages/Login';
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
  const response = await fetch('http://localhost:5000/api/qcms');
  if (!response.ok) throw new Error('Erreur lors du chargement des QCMs');
  return response.json();
};
