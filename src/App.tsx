import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { Sidebar } from './components/layout/Sidebar';
import LandingPage from './pages/LandingPage';
import ChatInterface from './pages/ChatInterface';
import PlanView from './pages/PlanView';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isMockMode } = useAuthStore();

  if (!isAuthenticated && !isMockMode) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isMockMode } = useAuthStore();
  const showSidebar = isAuthenticated || isMockMode;

  return (
    <div className="min-h-screen bg-background">
      {showSidebar && <Sidebar />}
      <main className={`${showSidebar ? 'lg:pl-64' : ''}`}>{children}</main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
