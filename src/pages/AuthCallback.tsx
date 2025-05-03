import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { createAuthService } from '../lib/services/auth.service';
import { useAuthStore } from '../store/auth';

const AuthCallback: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { setUser } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const authService = createAuthService();
      try {
        const { user, error } = await authService.handleAuthCallback();
        if (error) {
          console.error('Auth callback error:', error);
          setError(error);
          return;
        }

        if (user) {
          setUser({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          });
        }
      } catch (err) {
        console.error('Failed to process auth callback:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [setUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Completing authentication...</h2>
          <p>Please wait while we log you in.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2 text-red-500">Authentication failed</h2>
          <p>{error.message}</p>
          <a href="/login" className="mt-4 inline-block text-blue-500">
            Back to login
          </a>
        </div>
      </div>
    );
  }

  // Redirect to the dashboard page on successful authentication
  return <Navigate to="/dashboard" replace />;
};

export default AuthCallback;