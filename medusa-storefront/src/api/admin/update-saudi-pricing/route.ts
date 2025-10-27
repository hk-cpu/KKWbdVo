import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { updateSaudiPricingWorkflow } from "../../../workflows/update-saudi-pricing"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { productIds, sarRate } = req.body || {}
    
    const { result } = await updateSaudiPricingWorkflow(req.scope)
      .run({
        input: {
          productIds,
          sarRate: sarRate || 3.75, // Default SAR to USD rate
        }
      })

    res.json({
      success: true,
      message: `Updated ${result.count} product variants with SAR pricing`,
      data: result,
    })
  } catch (error) {
    console.error("Error updating Saudi pricing:", error)
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update pricing",
    })
  }
}
