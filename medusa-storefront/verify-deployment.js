#!/usr/bin/env node

/**
 * Deployment Verification Script
 * This script verifies that all necessary components are in place for Vercel deployment
 * with the specific project ID: prj_jf60a6NitGCf4s7Ggo0rA3uuhoFa
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Vercel Deployment Configuration...\n');

// Check 1: Required files exist
console.log('1. Checking required files...');
const requiredFiles = [
  'vercel.json',
  'package.json',
  'start-server.js',
  'medusa-config.ts',
  '.env.production'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    allFilesExist = false;
  }
}

console.log('\n2. Checking Vercel project ID configuration...');
// Check vercel.json for project ID
try {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf8'));
  if (vercelConfig.builds && vercelConfig.builds[0].config && vercelConfig.builds[0].config['project-id'] === 'prj_jf60a6NitGCf4s7Ggo0rA3uuhoFa') {
    console.log('   ✅ Vercel project ID correctly configured in vercel.json');
  } else {
    console.log('   ❌ Vercel project ID not found or incorrect in vercel.json');
  }
  
  if (vercelConfig.env && vercelConfig.env.VERCEL_PROJECT_ID === 'prj_jf60a6NitGCf4s7Ggo0rA3uuhoFa') {
    console.log('   ✅ VERCEL_PROJECT_ID environment variable set');
  } else {
    console.log('   ❌ VERCEL_PROJECT_ID environment variable not found or incorrect');
  }
} catch (error) {
  console.log('   ❌ Error reading vercel.json:', error.message);
}

console.log('\n3. Checking environment variables...');
// Check .env.production for Vercel-specific configurations
try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env.production'), 'utf8');
  
  // Check for Vercel project ID in comments
  if (envContent.includes('prj_jf60a6NitGCf4s7Ggo0rA3uuhoFa')) {
    console.log('   ✅ Vercel project ID found in .env.production');
  } else {
    console.log('   ⚠️  Vercel project ID not found in .env.production comments');
  }
  
  // Check for placeholder values that need to be updated
  const placeholders = [
    'forme_haus_user',
    'forme_haus_password',
    'forme_haus_redis_password',
    'pk_forme_haus_publishable_key'
  ];
  
  let placeholdersFound = false;
  for (const placeholder of placeholders) {
    if (envContent.includes(placeholder)) {
      console.log(`   ⚠️  Placeholder value found: ${placeholder}`);
      placeholdersFound = true;
    }
  }
  
  if (!placeholdersFound) {
    console.log('   ✅ No obvious placeholder values found');
  }
  
} catch (error) {
  console.log('   ❌ Error reading .env.production:', error.message);
}

console.log('\n4. Checking package.json scripts...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  if (packageJson.scripts && packageJson.scripts['deploy:vercel']) {
    console.log('   ✅ deploy:vercel script found');
  } else {
    console.log('   ⚠️  deploy:vercel script not found');
  }
  
  if (packageJson.scripts && packageJson.scripts['generate:secrets']) {
    console.log('   ✅ generate:secrets script found');
  } else {
    console.log('   ⚠️  generate:secrets script not found');
  }
} catch (error) {
  console.log('   ❌ Error reading package.json:', error.message);
}

console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('✅ All required files are present!');
  console.log('\n📋 Next steps:');
  console.log('1. Update placeholder values in .env.production with actual production credentials');
  console.log('2. Commit and push your changes to your Git repository');
  console.log('3. Connect your repository to Vercel using project ID: prj_jf60a6NitGCf4s7Ggo0rA3uuhoFa');
  console.log('4. Set environment variables in Vercel dashboard');
  console.log('5. Deploy your application!');
} else {
  console.log('❌ Some required files are missing. Please check the file list above.');
}