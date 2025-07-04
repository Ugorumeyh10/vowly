import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setError('No login token provided.');
        return;
      }

      try {
        const response = await fetch('https://vowly-backend.vowly.workers.dev/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) throw new Error('Failed to verify login token.');

        const { token: sessionToken } = await response.json();
        login(sessionToken);
        navigate('/');
      } catch (err) {
        setError(err.message);
      }
    };
    verifyToken();
  }, [searchParams, login, navigate]);

  return <div className="text-center p-10">{error ? `Error: ${error}` : 'Verifying your login...'}</div>;
}

export default Callback;