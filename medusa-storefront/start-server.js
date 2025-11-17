const { createApp, runMigrations } = require('@medusajs/framework');
const { loadEnv } = require('@medusajs/framework/utils');

// Load environment variables
loadEnv(process.env.NODE_ENV || 'development', process.cwd());

async function startServer() {
  try {
    console.log('Starting Medusa server...');
    
    // Load the Medusa configuration
    const configModule = require('./medusa-config');
    
    // Run migrations
    await runMigrations({ configModule });
    
    // Create and start the Medusa application
    const app = await createApp({
      configModule,
      port: process.env.PORT || 9000, // Use Vercel's PORT or default to 9000
    });
    
    console.log(`Medusa server started on port ${process.env.PORT || 9000}`);
    
    // Export the app for Vercel
    module.exports = app;
  } catch (error) {
    console.error('Error starting Medusa server:', error);
  }
}

// Check if we're running on Vercel
if (require.main === module) {
  startServer();
} else {
  // Export for Vercel
  module.exports = startServer;
}