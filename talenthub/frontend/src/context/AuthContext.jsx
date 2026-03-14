import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('talenthub_token');
    const stored = localStorage.getItem('talenthub_user');
    return token && stored ? JSON.parse(stored) : null;
  });

  const login = (token, userData) => {
    localStorage.setItem('talenthub_token', token);
    localStorage.setItem('talenthub_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('talenthub_token');
    localStorage.removeItem('talenthub_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);