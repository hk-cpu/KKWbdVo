import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")
  const categoryId = req.params.id

  try {
    const { data: categories } = await query.graph({
      entity: "product_category",
      fields: [
        "id",
        "name",
        "handle",
        "description",
        "is_active",
        "is_internal",
        "parent_category_id",
        "rank",
        "metadata",
        "products.*",
        "products.variants.*",
        "products.images.*",
      ],
      filters: { id: categoryId },
    })

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        message: "Product category not found",
      })
    }

    const category = categories[0]

    res.json({
      category: {
        id: category.id,
        name: category.name,
        handle: category.handle,
        description: category.description,
        is_active: category.is_active,
        parent_category_id: category.parent_category_id,
        rank: category.rank,
        metadata: category.metadata,
        product_count: category.products?.length || 0,
        products: category.products || [],
      },
    })
  } catch (error) {
    console.error("[product-categories/:id] Error:", error)
    res.status(500).json({
      message: "Failed to fetch product category",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
