import { useNavigate, Navigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SupabaseAuthService } from '@/lib/services/auth.service';
import { useAuthStore } from '@/store/auth';
import { isSafeMode } from '@/lib/utils';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, initMockSession } = useAuthStore();

  // If in safe mode and not authenticated, initialize mock session
  if (isSafeMode() && !isAuthenticated) {
    initMockSession();
    return <Navigate to="/dashboard" replace />;
  }

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async () => {
    const authService = new SupabaseAuthService();
    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        await authService.signIn();
      } catch (error) {
        console.error('Error signing in:', error);
      }
    } else {
      // Mock mode
      initMockSession();
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full flex items-center justify-center gap-2" onClick={handleLogin}>
            <LogIn className="w-5 h-5" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}