# Netlify Deployment Guide

## Prerequisites

1. A GitHub account
2. A Netlify account
3. A Supabase account (if using authentication and database features)

## Setup Steps

### 1. Prepare Your Environment Variables

Create a `.env` file based on the `.env.example`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Deploy to Netlify

There are two ways to deploy:

#### A. Deploy with Git (Recommended)

1. Push your code to a GitHub repository
2. Log in to Netlify
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repository
5. Configure build settings:
   - Build command: `npm run build` (pre-configured in netlify.toml)
   - Publish directory: `dist` (pre-configured in netlify.toml)
   - Node version: 20 (pre-configured in netlify.toml)

#### B. Deploy manually

1. Run `npm run build` locally
2. Drag and drop the `dist` folder to Netlify's manual deploy area

### 3. Environment Variables

Set up these environment variables in Netlify:

1. Go to Site settings → Environment variables
2. Add the following:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 4. Configure Netlify Functions

The `netlify.toml` file already includes the necessary configuration:
- Functions directory: `netlify/functions`
- Node bundler: esbuild
- External modules configuration

### 5. Domain and HTTPS

1. Netlify automatically provides a subdomain (e.g., `your-app.netlify.app`)
2. To use a custom domain:
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Follow the DNS configuration instructions

### 6. Continuous Deployment

With Git deployment:
- Every push to the main branch triggers a new deployment
- Preview deployments are created for pull requests

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run netlify:dev
   ```
   This command runs both the Vite dev server and Netlify Functions locally.

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Netlify dashboard
   - Ensure all dependencies are in `package.json`
   - Verify environment variables are set

2. **Function Errors**
   - Check function logs in Netlify dashboard
   - Verify function permissions and environment variables
   - Test functions locally with `npm run netlify:dev`

3. **Routing Issues**
   - The `netlify.toml` includes SPA redirect rules
   - Check the `[[redirects]]` section if adding new routes

### Support Resources

- [Netlify Docs](https://docs.netlify.com)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Netlify Functions](https://docs.netlify.com/functions/overview)

## Security Considerations

1. Never commit `.env` files
2. Use environment variables for sensitive data
3. Set up proper headers and security policies
4. Configure proper CORS settings in functions

## Monitoring

1. Enable Netlify Analytics for traffic insights
2. Set up error notifications
3. Monitor function usage and performance