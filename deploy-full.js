#!/usr/bin/env node

/**
 * Full deployment script for FORMÉ HAUS to Vercel
 * This script provides guidance for deploying both frontend and backend
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 FORMÉ HAUS Full Deployment Script\n');

console.log('This project consists of two parts that need to be deployed separately:');
console.log('1. Frontend (static site) - Root directory');
console.log('2. Backend (Medusa API) - medusa-storefront directory\n');

console.log('📋 DEPLOYMENT CHECKLIST:\n');

// Check if required files exist
const frontendFiles = [
  'vercel.json',
  'package.json',
  'index.html'
];

const backendFiles = [
  'medusa-storefront/vercel.json',
  'medusa-storefront/package.json',
  'medusa-storefront/start-server.js',
  'medusa-storefront/medusa-config.ts'
];

console.log('🔍 Checking frontend files...');
let frontendReady = true;
for (const file of frontendFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file} - Found`);
  } else {
    console.log(`  ❌ ${file} - Missing`);
    frontendReady = false;
  }
}

console.log('\n🔍 Checking backend files...');
let backendReady = true;
for (const file of backendFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file} - Found`);
  } else {
    console.log(`  ❌ ${file} - Missing`);
    backendReady = false;
  }
}

console.log('\n' + '='.repeat(60) + '\n');

if (frontendReady && backendReady) {
  console.log('✅ All required files are present!\n');
  
  console.log('📝 DEPLOYMENT INSTRUCTIONS:\n');
  
  console.log('FRONTEND DEPLOYMENT (Root Directory):');
  console.log('-------------------------------------');
  console.log('1. Go to Vercel dashboard (https://vercel.com/dashboard)');
  console.log('2. Click "New Project"');
  console.log('3. Import your Git repository');
  console.log('4. Set root directory to "/" (root of repository)');
  console.log('5. Vercel should automatically detect the vercel.json configuration');
  console.log('6. Deploy!\n');
  
  console.log('BACKEND DEPLOYMENT (Medusa Storefront):');
  console.log('---------------------------------------');
  console.log('1. Go to Vercel dashboard (https://vercel.com/dashboard)');
  console.log('2. Click "New Project"');
  console.log('3. Import the same Git repository');
  console.log('4. Set root directory to "medusa-storefront"');
  console.log('5. Vercel should automatically detect the vercel.json configuration');
  console.log('6. Set the following environment variables:');
  console.log('   - DATABASE_URL (your PostgreSQL connection string)');
  console.log('   - REDIS_URL (your Redis connection string)');
  console.log('   - STORE_CORS (your frontend Vercel URL)');
  console.log('   - ADMIN_CORS (your frontend Vercel URL)');
  console.log('   - AUTH_CORS (your frontend Vercel URL)');
  console.log('   - JWT_SECRET (generate a secure random string)');
  console.log('   - COOKIE_SECRET (generate a secure random string)');
  console.log('   - TOLGEE_API_KEY (if using localization)');
  console.log('   - TOLGEE_PROJECT_ID (if using localization)');
  console.log('7. Deploy!\n');
  
  console.log('POST-DEPLOYMENT CONFIGURATION:');
  console.log('------------------------------');
  console.log('1. After deploying both projects, note the URLs:');
  console.log('   - Frontend URL (e.g., forme-haus.vercel.app)');
  console.log('   - Backend URL (e.g., forme-haus-backend.vercel.app)');
  console.log('2. Update environment variables in both projects with the actual URLs:');
  console.log('   - In frontend: Update VITE_MEDUSA_BACKEND_URL with backend URL');
  console.log('   - In backend: Update CORS variables with frontend URL');
  console.log('3. Redeploy both projects\n');
  
  console.log('PREVIEW DEPLOYMENT:');
  console.log('-------------------');
  console.log('Vercel automatically creates preview deployments for pull requests.');
  console.log('Each pull request will get its own preview URL for testing.\n');
  
  console.log('For detailed instructions, check:');
  console.log('- medusa-storefront/DEPLOYMENT_INSTRUCTIONS.md');
  console.log('- medusa-storefront/DEPLOYMENT_SUMMARY.md');
  
} else {
  console.log('❌ Some required files are missing.');
  console.log('Please ensure all required files are present before deploying.');
  console.log('\nMissing files:');
  if (!frontendReady) console.log('  Frontend files missing');
  if (!backendReady) console.log('  Backend files missing');
}