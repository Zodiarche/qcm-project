import { createContext, useContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
  refetchProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchProfile = async (token: string | null) => {
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('token'));
  const [userId, setUserId] = useState<string | null>(sessionStorage.getItem('userId'));
  const queryClient = useQueryClient();

  const {
    isSuccess,
    isError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => fetchProfile(token),
    enabled: !!token,
    retry: false,
  });

  const login = (newToken: string, newUserId: string) => {
    setToken(newToken);
    setUserId(newUserId);
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('userId', newUserId);
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    queryClient.clear(); // Supprime les données du cache
  };

  if (isError) {
    logout();
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isSuccess,
        token,
        userId,
        login,
        logout,
        refetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return context;
};
