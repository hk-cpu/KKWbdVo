import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")
  
  // Get query parameters
  const limit = parseInt(req.query.limit as string) || 24
  const offset = parseInt(req.query.offset as string) || 0
  const collection_id = req.query.collection_id as string
  const type_id = req.query.type_id as string

  try {
    // Build filters
    const filters: any = {}
    if (collection_id) {
      filters.collection_id = collection_id
    }
    if (type_id) {
      filters.type_id = type_id
    }

    // Query products with enhanced fields
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "handle",
        "description",
        "thumbnail",
        "images.*",
        "variants.*",
        "variants.prices.*",
        "options.*",
        "collection_id",
        "type_id",
      ],
      filters,
      pagination: {
        skip: offset,
        take: limit,
      },
    })

    // Format response for frontend
    const formattedProducts = products.map((product: any) => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      thumbnail: product.thumbnail,
      images: product.images?.map((img: any) => ({
        id: img.id,
        url: img.url,
      })) || [],
      variants: product.variants?.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        prices: variant.prices?.map((price: any) => ({
          amount: price.amount,
          currency_code: price.currency_code,
        })) || [],
      })) || [],
      options: product.options?.map((option: any) => ({
        id: option.id,
        title: option.title,
      })) || [],
      collection_id: product.collection_id,
      type_id: product.type_id,
    }))

    res.json({
      products: formattedProducts,
      count: formattedProducts.length,
      offset,
      limit,
    })
  } catch (error) {
    console.error("[products-enhanced] Error:", error)
    res.status(500).json({
      message: "Failed to fetch products",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
