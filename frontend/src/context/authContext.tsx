import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('token'));
  const [userId, setUserId] = useState<string | null>(sessionStorage.getItem('userId'));

  const login = (newToken: string, newUserId: string) => {
    setToken(newToken);
    setUserId(newUserId);
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('userId', newUserId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
  };

  return <AuthContext.Provider value={{ isAuthenticated: !!token, token, userId, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return context;
};
