import {
  type SubscriberConfig,
  type SubscriberArgs,
} from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

/**
 * Subscriber that automatically adds SAR pricing when a new product is created
 * This ensures all new products have Saudi market pricing from the start
 */
export default async function handleProductCreated({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  const productService = container.resolve(Modules.PRODUCT)
  
  const productId = data.id
  
  logger.info(`[Subscriber] New product created: ${productId}`)
  
  try {
    // Get the newly created product
    const product = await productService.retrieveProduct(productId, {
      relations: ["variants", "variants.prices"],
    })
    
    if (!product.variants || product.variants.length === 0) {
      logger.info(`[Subscriber] Product ${productId} has no variants, skipping SAR pricing`)
      return
    }
    
    const sarRate = 3.75 // SAR to USD conversion rate
    let updatedCount = 0
    
    for (const variant of product.variants) {
      if (!variant.prices || variant.prices.length === 0) continue
      
      // Check if SAR price already exists
      const hasSarPrice = variant.prices.some(p => p.currency_code === 'sar')
      if (hasSarPrice) continue
      
      // Find USD price to calculate SAR price
      const usdPrice = variant.prices.find(p => p.currency_code === 'usd')
      if (!usdPrice) continue
      
      // Calculate and add SAR price
      const sarAmount = Math.round(usdPrice.amount * sarRate)
      
      await productService.updateProductVariants(variant.id, {
        prices: [
          ...variant.prices,
          {
            amount: sarAmount,
            currency_code: 'sar',
          }
        ]
      })
      
      updatedCount++
      logger.info(`[Subscriber] Added SAR pricing (${sarAmount/100} SAR) to variant ${variant.id}`)
    }
    
    logger.info(`[Subscriber] Completed: Added SAR pricing to ${updatedCount} variants of product ${product.title}`)
  } catch (error) {
    logger.error(`[Subscriber] Failed to add SAR pricing to product ${productId}:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "product.created",
}
