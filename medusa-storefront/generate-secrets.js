#!/usr/bin/env node

/**
 * Script to generate secure secrets for JWT and COOKIE
 * Run this script to generate strong secrets for production
 */

const crypto = require('crypto');

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

console.log('🔐 Generating secure secrets for Medusa production deployment...\n');

const jwtSecret = generateSecret();
const cookieSecret = generateSecret();

console.log('✅ Generated JWT Secret:');
console.log(jwtSecret);
console.log('\n✅ Generated Cookie Secret:');
console.log(cookieSecret);
console.log('\n📋 Instructions:');
console.log('1. Copy the JWT secret and replace the JWT_SECRET value in .env.production');
console.log('2. Copy the Cookie secret and replace the COOKIE_SECRET value in .env.production');
console.log('3. NEVER commit these secrets to version control!');
console.log('4. Store them securely in Vercel environment variables only.');