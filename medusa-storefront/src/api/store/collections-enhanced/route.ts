import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")
  
  const limit = parseInt(req.query.limit as string) || 20

  try {
    const { data: collections } = await query.graph({
      entity: "product_collection",
      fields: [
        "id",
        "title",
        "handle",
        "metadata",
      ],
      pagination: {
        take: limit,
      },
    })

    res.json({
      collections,
      count: collections.length,
    })
  } catch (error) {
    console.error("[collections-enhanced] Error:", error)
    res.status(500).json({
      message: "Failed to fetch collections",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
