# Supabase Authentication Integration Guide

This guide explains how to implement Supabase authentication in the Hybrid Toolbox application, replacing the current mock user system.

## Prerequisites

- Supabase account and project set up
- Environment variables configured as described in DEVELOPMENT.md
- Basic understanding of authentication flows

## Initial Setup

### 1. Configure Environment Variables

Ensure your `.env` file includes these variables:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Install Dependencies

```bash
npm install @supabase/supabase-js
```

## Implementation Steps

### 1. Create Supabase Client

Create a new file at `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### 2. Define Type Definitions

Create the database type definition at `src/types/supabase.ts`:

```typescript
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string | null;
          avatar_url: string | null;
          fitness_level: 'beginner' | 'intermediate' | 'advanced' | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string | null;
          avatar_url?: string | null;
          fitness_level?: 'beginner' | 'intermediate' | 'advanced' | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          updated_at?: string | null;
          avatar_url?: string | null;
          fitness_level?: 'beginner' | 'intermediate' | 'advanced' | null;
        };
      };
      // Add other tables as needed
    };
  };
};

export type UserProfile = Database['public']['Tables']['profiles']['Row'];
```

### 3. Create Authentication Service

Create an auth service at `src/lib/auth.ts`:

```typescript
import { supabase } from './supabase';
import type { UserProfile } from '../types/supabase';

export interface AuthService {
  login(
    email: string,
    password: string
  ): Promise<{ user: UserProfile | null; error: string | null }>;
  signup(
    email: string,
    password: string,
    userData: Partial<UserProfile>
  ): Promise<{ user: UserProfile | null; error: string | null }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserProfile | null>;
  resetPassword(email: string): Promise<{ success: boolean; error: string | null }>;
  updateProfile(data: Partial<UserProfile>): Promise<{ success: boolean; error: string | null }>;
}

class SupabaseAuthService implements AuthService {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      return { user: null, error: profileError.message };
    }

    return { user: profile, error: null };
  }

  async signup(email: string, password: string, userData: Partial<UserProfile>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      // Create profile entry
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email,
            full_name: userData.full_name,
            avatar_url: userData.avatar_url,
            fitness_level: userData.fitness_level,
          },
        ])
        .select('*')
        .single();

      if (profileError) {
        return { user: null, error: profileError.message };
      }

      return { user: profile, error: null };
    }

    return { user: null, error: 'Failed to create user' };
  }

  async logout() {
    await supabase.auth.signOut();
  }

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return profile;
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    return { success: !error, error: error?.message || null };
  }

  async updateProfile(data: Partial<UserProfile>) {
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', authData.user.id);

    return { success: !error, error: error?.message || null };
  }
}

export const authService = new SupabaseAuthService();
```

### 4. Create Auth Context

Create an auth context at `src/context/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../lib/auth';
import type { UserProfile } from '../types/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signup: (email: string, password: string, userData: Partial<UserProfile>) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error: string | null }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for current user on mount
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    const { user, error } = await authService.login(email, password);

    if (user) {
      setUser(user);
      return { success: true, error: null };
    }

    return { success: false, error: error || 'Login failed' };
  };

  const signup = async (email: string, password: string, userData: Partial<UserProfile>) => {
    const { user, error } = await authService.signup(email, password, userData);

    if (user) {
      setUser(user);
      return { success: true, error: null };
    }

    return { success: false, error: error || 'Signup failed' };
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    const result = await authService.updateProfile(data);

    if (result.success && user) {
      setUser({ ...user, ...data });
    }

    return result;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 5. Wrap Your App With the Auth Provider

In your main app component (`src/App.tsx`):

```typescript
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your existing app components */}
    </AuthProvider>
  );
}
```

## Creating Auth Components

### Login Form

Create a login form component at `src/components/auth/LoginForm.tsx`:

```typescript
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Log in'}
      </Button>
    </form>
  );
}
```

### Signup Form

Similarly, create a signup form component at `src/components/auth/SignupForm.tsx`.

## Setting Up Protected Routes

Create a protected route component at `src/components/auth/ProtectedRoute.tsx`:

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

Use this component in your router:

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## Database Setup

Run the following SQL in your Supabase SQL editor to create the profiles table:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  avatar_url TEXT,
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced'))
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create a trigger to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## Migrating from Mock Users

To migrate from the current mock user system:

1. Identify all places where mock user data is used
2. Replace mock user references with `useAuth()` hook
3. Update components to handle loading states
4. Update API calls to include auth tokens

Example of replacing a mock user:

```typescript
// Before
import { mockUser } from '../data/mockUsers';

function ProfileComponent() {
  const user = mockUser;
  return <div>Hello, {user.full_name}</div>;
}

// After
import { useAuth } from '../context/AuthContext';

function ProfileComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return <div>Hello, {user.full_name}</div>;
}
```

## Troubleshooting

### Common Issues and Solutions

1. **User session not persisting**

   - Check browser localStorage/cookies are enabled
   - Ensure proper session handling in Supabase client

2. **Authentication errors**

   - Verify environment variables are correct
   - Check network requests in browser console
   - Verify email confirmation settings in Supabase dashboard

3. **Database errors**

   - Check RLS policies are configured correctly
   - Ensure database schema matches type definitions

4. **Token refresh issues**
   - Supabase handles token refresh automatically, but ensure your `supabase-js` version is up to date

## Additional Authentication Features

- **Social Login**: Enable providers in Supabase dashboard and use `supabase.auth.signInWithOAuth()`
- **MFA/2FA**: Configure in Supabase dashboard and implement in login flow
- **Session Management**: Use `supabase.auth.getSession()` to track user sessions

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [React Router Protection](https://reactrouter.com/docs/en/v6/examples/auth)
- [TypeScript Integration](https://supabase.com/docs/reference/javascript/typescript-support)
