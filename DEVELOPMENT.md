# Hybrid Toolbox Development Guide

## Project Overview

Hybrid Toolbox is a React-based web application that provides personalized fitness plans combining running and strength training. The application uses:

- React with TypeScript
- Tailwind CSS for styling
- Supabase for authentication and data storage
- Netlify Functions for serverless backend

## Getting Started

### Prerequisites

1. Node.js 20 or higher
2. npm 10 or higher
3. A Supabase account
4. A Netlify account (for deployment)

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hybrid-toolbox
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_URL=your_supabase_url
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   This will start:
   - Vite dev server on port 5173
   - Netlify Functions development server on port 8888

### Project Structure

```
├── netlify/
│   └── functions/        # Serverless functions
├── src/
│   ├── components/       # React components
│   ├── lib/             # Core utilities and services
│   ├── pages/           # Page components
│   ├── store/           # Global state management
│   └── types/           # TypeScript types
├── supabase/
│   └── migrations/      # Database migrations
```

## Development Workflow

### Authentication Flow

1. Users can sign in with Google OAuth through Supabase
2. Authentication state is managed in `src/store/auth.ts`
3. Protected routes redirect to login if unauthenticated
4. Mock mode is available when Supabase credentials are not set

### Database Management

1. Migrations are stored in `supabase/migrations/`
2. New migrations should be created for schema changes
3. RLS policies are defined in migrations
4. Local development uses Supabase project

### API Development

1. Netlify Functions are used for backend logic
2. Functions are in `netlify/functions/`
3. Each function handles CORS and authentication
4. Local testing uses `netlify dev`

### State Management

1. Zustand is used for global state
2. Authentication state in `src/store/auth.ts`
3. Component state uses React hooks
4. Services follow dependency injection pattern

## Configuration Files

### Vite Configuration (vite.config.ts)
```typescript
{
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  }
}
```

### Tailwind Configuration (tailwind.config.js)
- Custom color scheme
- Component class variants
- Animation utilities

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured
- React JSX support
- Module resolution settings

### Netlify Configuration (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[dev]
  command = "npm run dev"
  port = 8888
  targetPort = 5173
```

## Development Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run format`: Format with Prettier

## Best Practices

### Code Organization
1. Follow feature-based structure
2. Keep components small and focused
3. Use TypeScript for type safety
4. Implement proper error handling

### State Management
1. Use Zustand for global state
2. Keep component state local when possible
3. Implement proper state hydration
4. Use React Query for API state

### Performance
1. Lazy load routes
2. Implement proper memoization
3. Optimize bundle size
4. Use proper key props in lists

### Security
1. Implement proper CORS headers
2. Use RLS policies in Supabase
3. Validate all user input
4. Keep environment variables secure

## Troubleshooting

### Common Issues

1. **Environment Variables**
   - Check `.env` file exists
   - Verify Supabase credentials
   - Restart dev server after changes

2. **Authentication**
   - Verify OAuth configuration
   - Check redirect URLs
   - Test in incognito mode

3. **API Functions**
   - Check CORS headers
   - Verify function permissions
   - Test locally with `netlify dev`

4. **Database**
   - Verify RLS policies
   - Check migration order
   - Test queries in Supabase dashboard

### Development Tools

1. **Browser Extensions**
   - React Developer Tools
   - Redux DevTools (for debugging)
   - Supabase Developer Tools

2. **VS Code Extensions**
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript support

## Testing

1. **Unit Tests**
   - Component testing with Vitest
   - Service layer tests
   - Utility function tests

2. **Integration Tests**
   - API endpoint testing
   - Authentication flow testing
   - Database interaction tests

3. **E2E Tests**
   - User flow testing
   - Cross-browser testing
   - Mobile responsiveness

## Deployment

1. **Staging**
   - Deploy to preview URL
   - Run integration tests
   - Check performance metrics

2. **Production**
   - Deploy to Netlify
   - Monitor error rates
   - Check analytics

## Contributing

1. Fork the repository
2. Create feature branch
3. Follow code style guidelines
4. Submit pull request
5. Wait for review

Remember to update documentation when making significant changes to the codebase.