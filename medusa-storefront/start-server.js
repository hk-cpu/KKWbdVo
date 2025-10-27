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
      port: 9000,
    });
    
    console.log('Medusa server started on port 9000');
  } catch (error) {
    console.error('Error starting Medusa server:', error);
  }
}

startServer();