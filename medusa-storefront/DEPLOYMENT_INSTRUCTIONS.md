# Deploying Medusa Storefront on Vercel

This guide will help you deploy your Medusa storefront on Vercel.

## Prerequisites

1. A Vercel account
2. A GitHub/GitLab/Bitbucket account
3. A PostgreSQL database (can use Supabase, Render, or any other provider)
4. A Redis instance (can use Upstash, Render, or any other provider)

## Deployment Steps

### 1. Prepare Your Repository

1. Make sure all your changes are committed and pushed to your Git repository
2. Ensure the following files exist in your repository:
   - `vercel.json` (already configured)
   - `package.json`
   - `start-server.js`
   - `medusa-config.ts`
   - `.env.production` (with placeholder values)

### 2. Set Up Your Database

Before deploying, you need to set up a PostgreSQL database and Redis instance:

1. Create a PostgreSQL database with a provider like:
   - Supabase
   - Render
   - Railway
   - DigitalOcean

2. Create a Redis instance with a provider like:
   - Upstash
   - Render
   - Railway

### 3. Configure Environment Variables in Vercel

After importing your project to Vercel, you need to set the following environment variables in your Vercel project settings:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variables:

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `DATABASE_URL` | Your PostgreSQL database connection string | `postgresql://user:password@host:port/database` |
| `REDIS_URL` | Your Redis connection string | `redis://user:password@host:port` |
| `STORE_CORS` | Allowed origins for store API | `https://your-project.vercel.app` |
| `ADMIN_CORS` | Allowed origins for admin API | `https://your-project.vercel.app` |
| `AUTH_CORS` | Allowed origins for auth API | `https://your-project.vercel.app` |
| `JWT_SECRET` | Secret for signing JWT tokens | A random secure string |
| `COOKIE_SECRET` | Secret for signing cookies | A random secure string |
| `TOLGEE_API_KEY` | Your Tolgee API key (if using) | Your Tolgee API key |
| `TOLGEE_PROJECT_ID` | Your Tolgee project ID (if using) | Your Tolgee project ID |

### 4. Deploy Your Project

1. Go to your Vercel dashboard
2. Click "New Project"
3. Import your Git repository
4. Set the root directory to `medusa-storefront`
5. Vercel should automatically detect the `vercel.json` configuration
6. Add the environment variables as described above
7. Click "Deploy"

### 5. Post-Deployment Steps

After your first deployment:

1. Update the CORS environment variables with your actual Vercel domain
2. Re-deploy to apply the changes

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: Ensure your database URL is correct and the database is accessible from Vercel.

2. **Environment Variables Not Set**: Make sure all required environment variables are set in the Vercel dashboard.

3. **Build Failures**: Check the build logs in Vercel for specific error messages.

### Need Help?

If you encounter any issues during deployment, check the Medusa documentation or reach out to the Medusa community for support.