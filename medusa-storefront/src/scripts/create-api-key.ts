import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function createPublishableKey(
  container: MedusaContainer
) {
  const apiKeyModuleService = container.resolve(Modules.API_KEY)

  try {
    const key = await apiKeyModuleService.createApiKeys({
      title: "Development Store Key",
      type: "publishable",
      created_by: "admin"
    })

    console.log("\n✅ Publishable API Key Created Successfully!")
    console.log("\nToken:", key.token)
    console.log("\nAdd this line to your .env.local file:")
    console.log(`VITE_MEDUSA_PUBLISHABLE_KEY=${key.token}\n`)
    
    return key
  } catch (error) {
    console.error("Error creating API key:", error)
    throw error
  }
}
