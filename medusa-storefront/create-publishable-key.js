// Script to create a publishable API key for Medusa
import { Modules } from "@medusajs/utils";

async function createPublishableKey() {
  const { initialize } = await import("@medusajs/medusa");
  
  const container = await initialize();
  
  try {
    const apiKeyModuleService = container.resolve(Modules.API_KEY);
    
    // Create a publishable API key
    const publishableKey = await apiKeyModuleService.createApiKeys({
      title: "Development Store Key",
      type: "publishable",
      created_by: "admin"
    });
    
    console.log("\n✅ Publishable API Key created successfully!");
    console.log("\nKey Details:");
    console.log("ID:", publishableKey.id);
    console.log("Token:", publishableKey.token);
    console.log("\nAdd this to your .env.local file:");
    console.log(`VITE_MEDUSA_PUBLISHABLE_KEY=${publishableKey.token}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating publishable key:", error);
    process.exit(1);
  }
}

createPublishableKey();
