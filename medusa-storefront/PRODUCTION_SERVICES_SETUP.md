# Production Services Setup Guide

This guide will help you set up the required production services for your Medusa storefront deployment on Vercel.

## 1. PostgreSQL Database Setup

You can choose from several cloud providers for your PostgreSQL database:

### Option 1: Supabase (Recommended for beginners)
1. Go to [supabase.com](https://supabase.com/)
2. Sign up for a free account
3. Create a new project
4. Note down:
   - Database URL (in connection string format)
   - Password for the `postgres` user

### Option 2: Render
1. Go to [render.com](https://render.com/)
2. Sign up for an account
3. Create a new "PostgreSQL" database
4. Note down:
   - External Database URL
   - User and password

### Option 3: AWS RDS
1. Go to AWS RDS console
2. Create a new PostgreSQL database instance
3. Make sure it's publicly accessible
4. Note down:
   - Endpoint
   - Master username and password
   - Database name

## 2. Redis Instance Setup

### Option 1: Upstash (Recommended)
1. Go to [upstash.com](https://upstash.com/)
2. Sign up for a free account
3. Create a new Redis database
4. Note down:
   - Redis connection string (URL)
   - Password

### Option 2: Render
1. Go to [render.com](https://render.com/)
2. Create a new "Redis" instance
3. Note down:
   - External Redis URL

### Option 3: AWS ElastiCache
1. Go to AWS ElastiCache console
2. Create a new Redis cluster
3. Make sure it's publicly accessible
4. Note down:
   - Primary endpoint
   - Port

## 3. Updating Environment Variables

After setting up your services, update the [.env.production](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/.env.production) file with your actual values:

1. **DATABASE_URL**: Replace with your actual PostgreSQL connection string
2. **REDIS_URL**: Replace with your actual Redis connection string
3. **CORS settings**: Update after deploying to Vercel to reflect your actual domains
4. **VITE environment variables**: Update after deploying to Vercel to reflect your actual domains

## 4. Adding Environment Variables to Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each environment variable from your [.env.production](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/.env.production) file:
   - DATABASE_URL
   - REDIS_URL
   - STORE_CORS
   - ADMIN_CORS
   - AUTH_CORS
   - JWT_SECRET
   - COOKIE_SECRET
   - TOLGEE_API_URL
   - TOLGEE_API_KEY
   - TOLGEE_PROJECT_ID
   - VITE_MEDUSA_BACKEND_URL
   - VITE_MEDUSA_ADMIN_URL
   - VITE_MEDUSA_PUBLISHABLE_KEY

## 5. Example Connection Strings

### PostgreSQL Examples:
```
# Supabase
postgresql://postgres:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres

# Render
postgresql://[USER]:[PASSWORD]@dpg-[ID].postgres.render.com:5432/[DBNAME]

# AWS RDS
postgresql://[USER]:[PASSWORD]@[ENDPOINT].amazonaws.com:5432/[DBNAME]
```

### Redis Examples:
```
# Upstash
rediss://:[PASSWORD]@[ID].upstash.io:6379

# Render
rediss://redispw@[ID].redis.render.com:6379

# AWS ElastiCache
redis://[ENDPOINT].cache.amazonaws.com:6379
```

## 6. Security Best Practices

1. Never commit actual secrets to version control
2. Always use strong, randomly generated passwords
3. Use SSL/TLS connections (rediss:// for Redis, postgresql:// for PostgreSQL)
4. Restrict database access to only necessary IP addresses when possible
5. Regularly rotate your secrets

## 7. Next Steps

1. Set up your PostgreSQL database
2. Set up your Redis instance
3. Update your [.env.production](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/.env.production) file with actual values
4. Add environment variables to Vercel
5. Deploy your application