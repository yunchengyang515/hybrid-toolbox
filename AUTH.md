# Authentication Guide

## Overview

Hybrid Toolbox uses Supabase for authentication, providing:
- Google OAuth integration
- Session management
- Protected routes
- Development mock mode

## Setup Instructions

### Local Development

1. **Environment Setup**
   ```bash
   # Copy example env file
   cp .env.example .env
   ```

   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_URL=your_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Supabase Project Configuration**
   
   a. Create a new project in Supabase Dashboard
   
   b. Enable Google OAuth:
   - Go to Authentication > Providers
   - Enable Google provider
   - Create a Google OAuth app in [Google Cloud Console](https://console.cloud.google.com)
   - Add authorized domains:
     ```
     localhost:5173
     localhost:8888
     your-app.netlify.app
     ```
   - Add redirect URLs:
     ```
     http://localhost:5173/auth/callback
     http://localhost:8888/auth/callback
     https://your-app.netlify.app/auth/callback
     ```

3. **Database Setup**
   
   The migration file (`supabase/migrations/20250329234718_plain_bar.sql`) creates:
   - Profiles table
   - Row Level Security policies
   - User creation trigger

### Production Deployment

1. **Netlify Configuration**
   
   Add environment variables in Netlify dashboard:
   - Site settings > Environment variables
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_URL=your_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Update Supabase Settings**
   - Add your Netlify domain to authorized domains
   - Add production callback URL:
     ```
     https://your-app.netlify.app/auth/callback
     ```

## Authentication Flow

1. **Sign In**
   - User clicks "Sign in with Google"
   - Redirected to Google OAuth
   - On success, redirected to `/chat`
   - Profile created automatically via trigger

2. **Session Management**
   - Sessions persisted in localStorage
   - Auto-refresh of expired sessions
   - Automatic token rotation

3. **Protected Routes**
   ```typescript
   const ProtectedRoute = ({ children }) => {
     const { isAuthenticated } = useAuthStore();
     return isAuthenticated ? children : <Navigate to="/login" />;
   };
   ```

## Development Mock Mode

When Supabase credentials are not set:
- Authentication bypassed
- Mock user data provided
- Protected routes accessible
- Perfect for local development

```typescript
// Mock user data
{
  id: 'mock-id',
  email: 'mock@example.com',
  name: 'Mock User'
}
```

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` file
   - Use different keys for development/production
   - Keep service role key secure

2. **Row Level Security**
   ```sql
   -- Users can only access their own data
   CREATE POLICY "Users can read own profile"
     ON profiles FOR SELECT
     USING (auth.uid() = id);
   ```

3. **OAuth Security**
   - Use HTTPS in production
   - Validate redirect URLs
   - Implement CSRF protection

## Troubleshooting

1. **Common Issues**

   a. "No preview available"
   - Check Supabase credentials
   - Verify OAuth configuration
   - Check redirect URLs

   b. "Authentication failed"
   - Clear browser cache
   - Check console for errors
   - Verify Google OAuth setup

2. **Development Tools**
   - Supabase Dashboard
   - Browser DevTools
   - Network tab for OAuth flow

## API Integration

1. **Protected Endpoints**
   ```typescript
   const supabase = createClient(
     process.env.SUPABASE_URL,
     process.env.SUPABASE_SERVICE_ROLE_KEY
   );
   ```

2. **User Context**
   ```typescript
   const { user } = useAuthStore();
   // Access user.id, user.email, etc.
   ```

## Testing

1. **Local Testing**
   ```bash
   npm run dev
   ```
   - Test OAuth flow
   - Verify protected routes
   - Check mock mode

2. **Production Testing**
   - Test on deployment preview
   - Verify OAuth callbacks
   - Check session persistence

## Best Practices

1. **Security**
   - Use HTTPS only
   - Implement proper CORS
   - Secure environment variables

2. **User Experience**
   - Clear error messages
   - Smooth redirect flows
   - Proper loading states

3. **Development**
   - Use TypeScript
   - Implement proper error handling
   - Follow security guidelines