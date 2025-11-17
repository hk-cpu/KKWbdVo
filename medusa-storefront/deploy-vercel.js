#!/usr/bin/env node

/**
 * Helper script for deploying Medusa to Vercel
 * This script provides guidance and checks for common deployment issues
 */

const fs = require('fs');
const path = require('path');

// Check if required files exist
const requiredFiles = [
  'vercel.json',
  'package.json',
  'start-server.js',
  'medusa-config.ts'
];

console.log('🔍 Checking for required files...\n');

let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - Found`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allFilesExist = false;
  }
}

console.log('\n' + '='.repeat(50) + '\n');

if (allFilesExist) {
  console.log('✅ All required files are present!\n');
  
  console.log('📝 Next steps for Vercel deployment:\n');
  
  console.log('1. Update .env.production with your actual values:');
  console.log('   - DATABASE_URL');
  console.log('   - REDIS_URL');
  console.log('   - JWT_SECRET (generate a secure random string)');
  console.log('   - COOKIE_SECRET (generate a secure random string)\n');
  
  console.log('2. Commit and push your changes to your Git repository\n');
  
  console.log('3. Go to Vercel dashboard and import your project:\n');
  
  console.log('4. Set the following environment variables in Vercel:');
  console.log('   - DATABASE_URL');
  console.log('   - REDIS_URL');
  console.log('   - STORE_CORS (e.g., https://your-project.vercel.app)');
  console.log('   - ADMIN_CORS (e.g., https://your-project.vercel.app)');
  console.log('   - AUTH_CORS (e.g., https://your-project.vercel.app)');
  console.log('   - JWT_SECRET');
  console.log('   - COOKIE_SECRET');
  console.log('   - TOLGEE_API_KEY (if using localization)');
  console.log('   - TOLGEE_PROJECT_ID (if using localization)\n');
  
  console.log('5. Deploy your project!\n');
  
  console.log('For detailed instructions, check DEPLOYMENT_INSTRUCTIONS.md');
} else {
  console.log('❌ Some required files are missing.');
  console.log('Please ensure all required files are present before deploying.');
}