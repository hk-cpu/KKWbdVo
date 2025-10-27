 const { MedusaAppLoader } = require('@medusajs/framework');
const { loadEnv } = require('@medusajs/framework/utils');

// Load environment variables
loadEnv(process.env.NODE_ENV || 'development', process.cwd());

async function startServer() {
  try {
    console.log('Starting Medusa server...');
    
    // Load the Medusa configuration
    const configModule = require('./medusa-config');
    
    // Create and start the Medusa application using MedusaAppLoader
    const appLoader = new MedusaAppLoader({
      configModule,
      port: 9000,
    });
    
    await appLoader.load();
    
    console.log('Medusa server started on port 9000');
  } catch (error) {
    console.error('Error starting Medusa server:', error);
  }
}

startServer();