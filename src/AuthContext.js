import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtVerify } from 'jose';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('vowly_token'));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          // In a real app, you'd verify against a public key, but for simplicity,
          // we'll just decode it here to get the user payload. The backend does the real verification.
          const { payload } = await jwtVerify(token, new TextEncoder().encode('dummy-secret-for-decoding-only'), {
            // This is a trick to decode without full verification on the client.
            // The real secret is only on the backend.
            algorithms: ['HS256'],
          }).catch(() => ({ payload: null }));

          if (payload && payload.exp * 1000 > Date.now()) {
            setUser({ name: payload.name, email: payload.email });
          } else {
            // Token is invalid or expired
            localStorage.removeItem('vowly_token');
            setToken(null);
            setUser(null);
          }
        } catch (e) {
          // Ignore decoding errors on the client
        }
      }
      setIsLoading(false);
    };
    validateToken();
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('vowly_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('vowly_token');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, isAuthenticated: !!user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};