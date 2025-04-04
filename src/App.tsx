import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { Sidebar } from './components/layout/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ChatInterface from './pages/ChatInterface';
import PlanView from './pages/PlanView';
import AuthCallback from './pages/AuthCallback';
import { supabase } from './lib/supabase';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isMockMode } = useAuthStore();

  if (!isAuthenticated && !isMockMode) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isMockMode } = useAuthStore();
  const showSidebar = isAuthenticated || isMockMode;

  return (
    <div className="min-h-screen bg-background flex">
      {showSidebar && <Sidebar />}
      <main className="flex-1">{children}</main>
    </div>
  );
};

function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name:
            session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        });
      } else {
        setUser(null);
      }
    });

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name:
            session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ChatInterface />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/plan"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PlanView />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
