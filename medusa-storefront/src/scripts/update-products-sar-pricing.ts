import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows";

// SAR to USD exchange rate (approximately 3.75 SAR = 1 USD)
const USD_TO_SAR_RATE = 3.75;

export default async function updateProductsSARPricing({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModuleService = container.resolve(Modules.PRODUCT);

  logger.info("Updating all products with SAR pricing...");

  // Get all products
  const products = await productModuleService.listProducts({});

  logger.info(`Found ${products.length} products to update.`);

  let updatedCount = 0;
  let pricesAdded = 0;

  for (const product of products) {
    logger.info(`Processing: ${product.title}`);
    
    // Get full product details with variants
    const [fullProduct] = await productModuleService.listProducts(
      { id: product.id },
      { relations: ["variants"] }
    );
    
    const variantsToUpdate: any[] = [];
    
    for (const variant of fullProduct?.variants || []) {
      try {
        // Get the variant with prices using retrieve
        const variantWithPrices = await productModuleService.retrieveProductVariant(
          variant.id,
          { relations: ["prices"] }
        );
        
        const prices = (variantWithPrices as any).prices || [];
        
        // Check if SAR price already exists
        const hasSARPrice = prices.some((p: any) => p.currency_code === "sar");
        
        if (!hasSARPrice) {
          // Get USD price to calculate SAR price
          const usdPrice = prices.find((p: any) => p.currency_code === "usd");
          
          if (usdPrice && usdPrice.amount) {
            const sarAmount = Math.round(Number(usdPrice.amount) * USD_TO_SAR_RATE);
            
            // Add SAR price to existing prices
            variantsToUpdate.push({
              id: variant.id,
              prices: [
                ...prices,
                {
                  currency_code: "sar",
                  amount: sarAmount,
                  rules: {},
                },
              ],
            });
            
            pricesAdded++;
            logger.info(`  ✓ Will add SAR ${(sarAmount / 100).toFixed(2)} (${variant.title || variant.sku})`);
          }
        } else {
          logger.info(`  → SAR price exists (${variant.title || variant.sku})`);
        }
      } catch (error) {
        logger.warn(`  ⚠ Could not process variant ${variant.id}: ${error}`);
      }
    }
    
    // Update product with new variant prices
    if (variantsToUpdate.length > 0) {
      try {
        await updateProductsWorkflow(container).run({
          input: {
            selector: { id: product.id },
            update: {
              variants: variantsToUpdate,
            },
          },
        });
        logger.info(`  ✅ Updated ${variantsToUpdate.length} variants for ${product.title}`);
      } catch (error) {
        logger.error(`  ❌ Failed to update ${product.title}: ${error}`);
      }
    }
    
    updatedCount++;
  }

  logger.info("✅ Product pricing update complete!");
  logger.info(`- Products processed: ${updatedCount}`);
  logger.info(`- SAR prices added: ${pricesAdded}`);
  logger.info(`- Exchange rate used: 1 USD = ${USD_TO_SAR_RATE} SAR`);
}
