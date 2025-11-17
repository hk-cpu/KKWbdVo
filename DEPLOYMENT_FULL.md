# Full Deployment Guide: Frontend and Backend on Vercel

This guide explains how to deploy both the frontend and backend of your Medusa application to Vercel.

## Project Structure

Your project has two main components:
1. **Frontend** - Static site in the root directory
2. **Backend** - Medusa server in the [medusa-storefront](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/) directory

## Deployment Strategy

Since Vercel is primarily designed for static sites and serverless functions, we'll deploy:
1. **Frontend** - As a static site from the root directory
2. **Backend** - As a serverless function from the [medusa-storefront](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/) directory

## Prerequisites

1. Vercel account
2. GitHub/GitLab/Bitbucket account
3. PostgreSQL database
4. Redis instance

## Step 1: Deploy the Backend (Medusa Server)

### 1.1 Create a new Vercel project for the backend

1. Go to your Vercel dashboard
2. Click "New Project"
3. Import your Git repository
4. Set the root directory to `medusa-storefront`
5. Vercel should automatically detect the [vercel.json](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/vercel.json) configuration

### 1.2 Configure environment variables for the backend

In your backend project settings, add these environment variables:

```
DATABASE_URL=your_production_postgresql_database_url
REDIS_URL=your_production_redis_url
JWT_SECRET=your_generated_jwt_secret
COOKIE_SECRET=your_generated_cookie_secret
STORE_CORS=https://your-frontend-domain.vercel.app
ADMIN_CORS=https://your-frontend-domain.vercel.app
AUTH_CORS=https://your-frontend-domain.vercel.app
TOLGEE_API_KEY=your_tolgee_api_key
TOLGEE_PROJECT_ID=your_tolgee_project_id
STORE_NAME=FORMÉ HAUS
```

### 1.3 Deploy the backend

Click "Deploy" and wait for the build to complete. Note the deployed URL.

## Step 2: Deploy the Frontend

### 2.1 Create a new Vercel project for the frontend

1. Go to your Vercel dashboard
2. Click "New Project"
3. Import your Git repository
4. Set the root directory to `/` (root)
5. Vercel should automatically detect the [vercel.json](file:///c:/Users/futte/Desktop/we are close/vercel.json) configuration

### 2.2 Configure environment variables for the frontend

In your frontend project settings, add these environment variables:

```
VITE_MEDUSA_BACKEND_URL=https://your-backend-domain.vercel.app
VITE_MEDUSA_ADMIN_URL=https://your-backend-domain.vercel.app
VITE_MEDUSA_PUBLISHABLE_KEY=your_publishable_api_key
```

### 2.3 Deploy the frontend

Click "Deploy" and wait for the build to complete.

## Step 3: Update CORS Settings

After both deployments are complete:

1. Update the backend environment variables with the actual frontend domain:
   ```
   STORE_CORS=https://your-frontend.vercel.app
   ADMIN_CORS=https://your-frontend.vercel.app
   AUTH_CORS=https://your-frontend.vercel.app
   ```

2. Redeploy the backend with updated CORS settings.

## Important Notes

1. **Database Migration**: The first deployment will automatically run database migrations.

2. **API Keys**: Make sure to generate a publishable API key for your Medusa backend and use it in the frontend.

3. **Environment Variables**: Never commit actual secrets to version control. Always use Vercel's environment variable system.

4. **Domains**: You can set up custom domains in Vercel after deployment.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure CORS environment variables match your actual deployed domains.

2. **Database Connection**: Verify your DATABASE_URL is correct and the database is accessible.

3. **Missing Environment Variables**: Check that all required environment variables are set in Vercel.

### Need Help?

If you encounter any issues during deployment, check the Medusa documentation or reach out to the Medusa community for support.