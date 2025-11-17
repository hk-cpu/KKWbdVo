# Deploying Medusa Storefront to Vercel

This guide explains how to deploy your Medusa storefront to Vercel.

## Prerequisites

1. A Vercel account
2. A production PostgreSQL database (you can use services like Supabase, AWS RDS, or Heroku Postgres)
3. Your Medusa backend environment variables

## Deployment Steps

### 1. Prepare Your Repository

Make sure your repository is pushed to GitHub, GitLab, or Bitbucket.

### 2. Configure Environment Variables on Vercel

In your Vercel project settings, add the following environment variables:

- `DATABASE_URL`: Your production PostgreSQL database URL
- `JWT_SECRET`: A secure random string for JWT tokens
- `COOKIE_SECRET`: A secure random string for cookies
- `STORE_CORS`: Your storefront domain (e.g., https://your-store.vercel.app)
- `ADMIN_CORS`: Your admin dashboard domain
- `AUTH_CORS`: Your authentication domains
- `TOLGEE_API_KEY`: Your Tolgee API key (if using localization)
- `TOLGEE_PROJECT_ID`: Your Tolgee project ID

### 3. Import Project to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your repository
4. Set the root directory to `medusa-storefront`
5. Vercel should automatically detect the framework

### 4. Configure Build Settings

Vercel should automatically use the configuration in [vercel.json](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/src/api/store/custom/vercel.json), but if needed, manually set:

- Build Command: `npm run vercel-build`
- Output Directory: Leave as default
- Install Command: `npm install`

### 5. Deploy

Click "Deploy" and wait for the build to complete.

## Important Notes

1. **Database**: You'll need a production PostgreSQL database. The local SQLite database won't work on Vercel.

2. **Migrations**: The deployment process will automatically run database migrations.

3. **CORS**: Make sure to update the CORS environment variables with your actual Vercel domains.

4. **Ports**: Vercel manages ports automatically through the `PORT` environment variable.

5. **Environment**: Vercel automatically sets `NODE_ENV` to "production".

## Troubleshooting

If you encounter issues:

1. Check the build logs in Vercel
2. Ensure all environment variables are correctly set
3. Verify your database connection string is correct
4. Make sure your database is accessible from Vercel's servers