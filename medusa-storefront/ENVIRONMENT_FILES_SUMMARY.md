# Environment Files Summary

This document summarizes all the environment files found in the project and their purposes.

## Root Directory Environment Files

### [.env.example](file:///c:/Users/futte/Desktop/we are close/.env.example)
- **Location**: Root directory
- **Purpose**: Template for Vite frontend environment variables
- **Contents**:
  - `VITE_MEDUSA_BACKEND_URL=http://localhost:9000`
  - `VITE_MEDUSA_ADMIN_URL=http://localhost:7001`

### [.env.local](file:///c:/Users/futte/Desktop/we are close/.env.local)
- **Location**: Root directory
- **Purpose**: Local development environment variables for Vite frontend
- **Contents**:
  - `VITE_MEDUSA_BACKEND_URL=http://localhost:9000`
  - `VITE_MEDUSA_ADMIN_URL=http://localhost:7001`
  - `VITE_MEDUSA_PUBLISHABLE_KEY=pk_51b3045f87cdc166fc04135996ef34c61b82a0676880ae91fbb20d2c09ed5db6`

## Medusa Storefront Directory Environment Files

### [.env](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/.env)
- **Location**: [medusa-storefront](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/) directory
- **Purpose**: Development environment variables for Medusa backend
- **Contents**:
  - `DATABASE_URL=postgres://medusa:medusa@localhost:5432/medusa`
  - `REDIS_URL=redis://localhost:6379`
  - `STORE_NAME=FORMÉ HAUS`
  - `STORE_CORS=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,http://localhost:3000`
  - `ADMIN_CORS=http://localhost:7000,http://localhost:7001`
  - `AUTH_CORS=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,http://localhost:3000,http://localhost:7000,http://localhost:7001`
  - `JWT_SECRET=supersecret`
  - `COOKIE_SECRET=supersecret`
  - Tolgee configuration values

### [.env.template](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/.env.template)
- **Location**: [medusa-storefront](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/) directory
- **Purpose**: Template for environment variables
- **Contents**:
  - CORS configuration templates
  - Redis URL template
  - JWT and Cookie secret templates
  - Database URL template

### [.env.production](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/.env.production)
- **Location**: [medusa-storefront](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/) directory
- **Purpose**: Production environment variables template for Vercel deployment
- **Contents**:
  - Production database URL template
  - Production Redis URL template
  - Production CORS settings templates
  - Secure JWT and Cookie secret templates
  - Tolgee production configuration templates
  - Frontend Vite environment variables for production

### [.env.test](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/.env.test)
- **Location**: [medusa-storefront](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/) directory
- **Purpose**: Test environment variables
- **Contents**: Empty file

## Deployment Instructions

When deploying to Vercel, you should:

1. Use the values from [.env](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/.env) and [.env.local](file:///c:/Users/futte/Desktop/we are close/.env.local) as references for setting up your production environment variables
2. Replace all placeholder values in [.env.production](file:///c:/Users/futte/Desktop/we are close/medusa-storefront/.env.production) with actual production values
3. Set these environment variables in your Vercel project dashboard
4. Generate secure secrets for JWT_SECRET and COOKIE_SECRET using the generate-secrets.js script