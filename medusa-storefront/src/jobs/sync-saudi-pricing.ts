import { MedusaContainer } from "@medusajs/framework/types"
import { updateSaudiPricingWorkflow } from "../workflows/update-saudi-pricing"

/**
 * Scheduled job to sync SAR pricing for all products daily
 * Runs every day at 2 AM
 */
export default async function syncSaudiPricing(
  container: MedusaContainer
) {
  const logger = container.resolve("logger")
  
  logger.info("[Scheduled Job] Starting daily Saudi pricing sync...")
  
  try {
    const { result } = await updateSaudiPricingWorkflow(container)
      .run({
        input: {
          sarRate: 3.75, // Standard SAR to USD conversion rate
        }
      })

    logger.info(`[Scheduled Job] Successfully updated ${result.count} product variants`)
    logger.info(`[Scheduled Job] Updated products:`, result.updatedProducts)
  } catch (error) {
    logger.error("[Scheduled Job] Failed to sync Saudi pricing:", error)
  }
}

export const config = {
  name: "sync-saudi-pricing-daily",
  // Run at 2:00 AM every day (Saudi Arabia time)
  schedule: `0 2 * * *`,
}
