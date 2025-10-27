import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")
  
  const limit = parseInt(req.query.limit as string) || 50
  const offset = parseInt(req.query.offset as string) || 0
  const includeProducts = req.query.include_products === "true"

  try {
    const fields = [
      "id",
      "name",
      "handle",
      "description",
      "is_active",
      "is_internal",
      "parent_category_id",
      "rank",
      "metadata",
    ]

    if (includeProducts) {
      fields.push("products.*")
    }

    const { data: categories } = await query.graph({
      entity: "product_category",
      fields,
      filters: {
        is_active: true,
        is_internal: false,
      },
      pagination: {
        skip: offset,
        take: limit,
      },
    })

    // Group categories by parent
    const rootCategories = categories.filter(c => !c.parent_category_id)
    const childCategories = categories.filter(c => c.parent_category_id)

    // Build category tree
    const categoryTree = rootCategories.map(parent => ({
      ...parent,
      product_count: parent.products?.length || 0,
      children: childCategories
        .filter(child => child.parent_category_id === parent.id)
        .map(child => ({
          ...child,
          product_count: child.products?.length || 0,
        })),
    }))

    res.json({
      categories: categoryTree,
      count: categories.length,
      offset,
      limit,
    })
  } catch (error) {
    console.error("[product-categories] Error:", error)
    res.status(500).json({
      message: "Failed to fetch product categories",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
