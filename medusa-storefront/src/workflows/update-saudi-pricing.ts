import { 
  createWorkflow, 
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

type UpdatePricingInput = {
  productIds?: string[]
  sarRate?: number // SAR to USD conversion rate
}

const updateSaudiPricingStep = createStep(
  "update-saudi-pricing",
  async ({ productIds, sarRate = 3.75 }: UpdatePricingInput, { container }) => {
    const productService = container.resolve(Modules.PRODUCT)
    const logger = container.resolve("logger")
    
    logger.info("Starting Saudi pricing update...")
    
    // Get all products if no IDs specified
    const products = productIds 
      ? await productService.listProducts({ id: productIds })
      : await productService.listProducts({})
    
    const updatedProducts = []
    
    for (const product of products) {
      if (!product.variants || product.variants.length === 0) continue
      
      for (const variant of product.variants) {
        if (!variant.prices) continue
        
        // Find USD price
        const usdPrice = variant.prices.find(p => p.currency_code === 'usd')
        if (!usdPrice) continue
        
        // Check if SAR price already exists
        const sarPriceExists = variant.prices.some(p => p.currency_code === 'sar')
        
        if (!sarPriceExists) {
          // Calculate SAR price based on USD
          const sarAmount = Math.round(usdPrice.amount * sarRate)
          
          // Add SAR pricing
          await productService.updateProductVariants(variant.id, {
            prices: [
              ...variant.prices,
              {
                amount: sarAmount,
                currency_code: 'sar',
              }
            ]
          })
          
          logger.info(`Added SAR pricing to ${product.title} - ${variant.title}: ${sarAmount/100} SAR`)
          updatedProducts.push({
            productId: product.id,
            variantId: variant.id,
            title: `${product.title} - ${variant.title}`,
            sarPrice: sarAmount
          })
        }
      }
    }
    
    logger.info(`Updated ${updatedProducts.length} product variants with SAR pricing`)
    
    return new StepResponse({ 
      updatedProducts,
      count: updatedProducts.length 
    }, updatedProducts)
  },
  async (updatedProducts, { container }) => {
    // Rollback: Remove SAR prices if workflow fails
    if (!updatedProducts || updatedProducts.length === 0) {
      return
    }
    
    const productService = container.resolve(Modules.PRODUCT)
    const logger = container.resolve("logger")
    
    logger.info("Rolling back SAR pricing updates...")
    
    for (const item of updatedProducts) {
      const variant = await productService.retrieveProductVariant(item.variantId)
      const pricesWithoutSar = variant.prices.filter(p => p.currency_code !== 'sar')
      
      await productService.updateProductVariants(item.variantId, {
        prices: pricesWithoutSar
      })
    }
    
    logger.info("Rollback completed")
  }
)

export const updateSaudiPricingWorkflow = createWorkflow(
  "update-saudi-pricing",
  (input: UpdatePricingInput) => {
    const { updatedProducts, count } = updateSaudiPricingStep(input)

    return new WorkflowResponse({
      updatedProducts,
      count,
    })
  }
)
