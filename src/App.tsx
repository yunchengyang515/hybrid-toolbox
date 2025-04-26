import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { Sidebar } from './components/layout/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CreatePlan from './pages/CreatePlan';
import MyPlans from './pages/MyPlans';
import AuthCallback from './pages/AuthCallback';
import { supabase } from './lib/supabase';
import { isSafeMode } from './lib/utils';

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
    <div className="min-h-screen bg-background">
      {showSidebar && <Sidebar />}
      <main className="lg:ml-64">{children}</main>
    </div>
  );
};

function App() {
  const { setUser, initSafeMode, isSafeMode: isSafeModeActive } = useAuthStore();

  useEffect(() => {
    // Auto-initialize safe mode if detected
    if (isSafeMode() && !isSafeModeActive) {
      console.log('Safe mode detected. Initializing mock session for frontend development.');
      initSafeMode();
      return;
    }

    // Regular auth flow for non-safe mode
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
  }, [setUser, initSafeMode, isSafeModeActive]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-plan"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CreatePlan />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-plans"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MyPlans />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;