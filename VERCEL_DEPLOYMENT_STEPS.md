# Vercel Deployment Steps for FORMÉ HAUS

## Prerequisites
1. A Vercel account (https://vercel.com)
2. A PostgreSQL database (instructions below)
3. A Redis instance (instructions below)

## Database Setup

### PostgreSQL Database
You need to create a PostgreSQL database. Here are some recommended providers:

#### Option 1: Supabase (Free Tier Available)
1. Go to https://supabase.com
2. Create a new project
3. Note your database connection string (Settings > Database > Connection Info)
4. Your DATABASE_URL will look like:
   `postgresql://postgres:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

#### Option 2: Render (Free Tier Available)
1. Go to https://render.com
2. Create a new PostgreSQL database
3. Note your connection details
4. Your DATABASE_URL will look like:
   `postgresql://[USER]:[PASSWORD]@dpg-[ID].postgres.render.com:5432/[DBNAME]`

### Redis Instance
You need to create a Redis instance. Here are some recommended providers:

#### Option 1: Upstash (Free Tier Available)
1. Go to https://upstash.com
2. Create a new Redis database
3. Note your connection string
4. Your REDIS_URL will look like:
   `rediss://:password@[ID].upstash.io:6379`

#### Option 2: Render (Free Tier Available)
1. Go to https://render.com
2. Create a new Redis instance
3. Note your connection details
4. Your REDIS_URL will look like:
   `rediss://redispw@[ID].redis.render.com:6379`

## Environment Variables

Use these exact variable names when setting up your Vercel environment variables:

### Backend Environment Variables (medusa-storefront project)
```
DATABASE_URL=postgresql://[YOUR-DATABASE-CONNECTION-STRING]
REDIS_URL=rediss://[YOUR-REDIS-CONNECTION-STRING]
STORE_CORS=https://[YOUR-FRONTEND-PROJECT-NAME].vercel.app
ADMIN_CORS=https://[YOUR-FRONTEND-PROJECT-NAME].vercel.app
AUTH_CORS=https://[YOUR-FRONTEND-PROJECT-NAME].vercel.app
JWT_SECRET=a8f11f0e1e4c69331a7452bfe6be94bce4dc477982635bb66c9f8e1f36e012ee8648334c8423c36643d25aa2593746f43eb25a04e25d3016a39465efa6b5ab4a
COOKIE_SECRET=bd742198a81bc4c5123879d846f8b98b5fd24e87644b8a933b250f1f8e4c4463b5e803eea9bb0b6c44ae81a6f6cef81f9868f4cf836bcf6c11b47380d93d0b33
TOLGEE_API_KEY=tgpak_gi2danzql52we5dvnvstm23bof3g42jqonrxk3lqg5ugiythmn2a
TOLGEE_PROJECT_ID=24072
```

### Frontend Environment Variables (root project)
```
VITE_MEDUSA_BACKEND_URL=https://[YOUR-BACKEND-PROJECT-NAME].vercel.app
VITE_MEDUSA_ADMIN_URL=https://[YOUR-BACKEND-PROJECT-NAME].vercel.app
VITE_MEDUSA_PUBLISHABLE_KEY=pk_51b3045f87cdc166fc04135996ef34c61b82a0676880ae91fbb20d2c09ed5db6
```

## Deployment Steps

### Step 1: Deploy the Backend (Medusa API)
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your Git repository (https://github.com/hk-cpu/KKWbdVo.git)
4. Set the root directory to `medusa-storefront`
5. In the "Environment Variables" section, add all the backend environment variables listed above
6. Click "Deploy"

### Step 2: Deploy the Frontend
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import the same Git repository (https://github.com/hk-cpu/KKWbdVo.git)
4. Set the root directory to `/` (the root of the repository)
5. In the "Environment Variables" section, add all the frontend environment variables listed above
6. Click "Deploy"

## Post-Deployment Configuration

After both projects are deployed:

1. Note the URLs assigned by Vercel:
   - Frontend URL (e.g., forme-haus.vercel.app)
   - Backend URL (e.g., forme-haus-backend.vercel.app)

2. Update the CORS environment variables in your backend project:
   - STORE_CORS=https://[YOUR-FRONTEND-URL]
   - ADMIN_CORS=https://[YOUR-FRONTEND-URL]
   - AUTH_CORS=https://[YOUR-FRONTEND-URL]

3. Update the frontend environment variables in your frontend project:
   - VITE_MEDUSA_BACKEND_URL=https://[YOUR-BACKEND-URL]

4. Redeploy both projects for the changes to take effect.

## Preview Deployments

Vercel automatically creates preview deployments for pull requests:
1. Create a new branch: `git checkout -b feature-branch`
2. Make your changes
3. Commit and push: `git push origin feature-branch`
4. Create a pull request on GitHub
5. Vercel will automatically create a preview deployment with a unique URL

## Need Help?

If you encounter any issues:
1. Check the build logs in your Vercel dashboard
2. Verify all environment variables are correctly set
3. Ensure your database and Redis instances are accessible from Vercel
4. Check the Medusa documentation at https://docs.medusajs.com