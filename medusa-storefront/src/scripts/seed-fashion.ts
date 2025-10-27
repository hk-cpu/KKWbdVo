import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedFashionProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModuleService = container.resolve(Modules.PRODUCT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

  logger.info("Starting fashion product seeding...");

  // Get default sales channel
  const [defaultSalesChannel] = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel) {
    logger.error("Default sales channel not found. Please run the main seed script first.");
    return;
  }

  // Get shipping profile
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  const shippingProfile = shippingProfiles[0];

  if (!shippingProfile) {
    logger.error("Default shipping profile not found. Please run the main seed script first.");
    return;
  }

  logger.info("Creating product types...");
  
  // Create Product Types
  const apparelType = await productModuleService.createProductTypes({
    value: "Apparel",
    metadata: { seasonal: true, featured: true },
  });

  const accessoriesType = await productModuleService.createProductTypes({
    value: "Accessories",
    metadata: { featured: false },
  });

  const outerwearType = await productModuleService.createProductTypes({
    value: "Outerwear",
    metadata: { seasonal: true, premium: true },
  });

  logger.info("Created product types.");

  logger.info("Creating fashion products...");

  await createProductsWorkflow(container).run({
    input: {
      products: [
        // Apparel Products
        {
          title: "Silk Drape Blouse",
          type_id: apparelType.id,
          description:
            "An elegant silk blouse with a luxurious drape. Perfect for both office and evening wear. Features a flattering V-neckline and subtle gathered sleeves.",
          handle: "silk-drape-blouse",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["XS", "S", "M", "L", "XL"],
            },
            {
              title: "Color",
              values: ["Ivory", "Black", "Navy"],
            },
          ],
          variants: [
            {
              title: "S / Ivory",
              sku: "SILK-BLOUSE-S-IVORY",
              options: { Size: "S", Color: "Ivory" },
              prices: [
                { amount: 12900, currency_code: "usd" },
                { amount: 11500, currency_code: "eur" },
                { amount: 48400, currency_code: "sar" },
              ],
            },
            {
              title: "M / Ivory",
              sku: "SILK-BLOUSE-M-IVORY",
              options: { Size: "M", Color: "Ivory" },
              prices: [
                { amount: 12900, currency_code: "usd" },
                { amount: 11500, currency_code: "eur" },
                { amount: 48400, currency_code: "sar" },
              ],
            },
            {
              title: "L / Black",
              sku: "SILK-BLOUSE-L-BLACK",
              options: { Size: "L", Color: "Black" },
              prices: [
                { amount: 12900, currency_code: "usd" },
                { amount: 11500, currency_code: "eur" },
                { amount: 48400, currency_code: "sar" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Linen Wide-Leg Trousers",
          type_id: apparelType.id,
          description:
            "Timeless wide-leg trousers crafted from premium Italian linen. The perfect blend of comfort and sophistication for warm weather.",
          handle: "linen-wide-leg-trousers",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["26", "28", "30", "32", "34"],
            },
            {
              title: "Color",
              values: ["Sand", "Charcoal", "White"],
            },
          ],
          variants: [
            {
              title: "28 / Sand",
              sku: "LINEN-TROUSER-28-SAND",
              options: { Size: "28", Color: "Sand" },
              prices: [
                { amount: 15900, currency_code: "usd" },
                { amount: 14200, currency_code: "eur" },
                { amount: 59600, currency_code: "sar" },
              ],
            },
            {
              title: "30 / Sand",
              sku: "LINEN-TROUSER-30-SAND",
              options: { Size: "30", Color: "Sand" },
              prices: [
                { amount: 15900, currency_code: "usd" },
                { amount: 14200, currency_code: "eur" },
                { amount: 59600, currency_code: "sar" },
              ],
            },
            {
              title: "30 / Charcoal",
              sku: "LINEN-TROUSER-30-CHARCOAL",
              options: { Size: "30", Color: "Charcoal" },
              prices: [
                { amount: 15900, currency_code: "usd" },
                { amount: 14200, currency_code: "eur" },
                { amount: 59600, currency_code: "sar" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Merino Wool Sweater",
          type_id: apparelType.id,
          description:
            "Ultra-soft merino wool sweater with a classic crewneck. Naturally temperature-regulating and perfect for layering.",
          handle: "merino-wool-sweater",
          weight: 280,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["XS", "S", "M", "L", "XL"],
            },
            {
              title: "Color",
              values: ["Camel", "Charcoal", "Cream"],
            },
          ],
          variants: [
            {
              title: "S / Camel",
              sku: "MERINO-SWEATER-S-CAMEL",
              options: { Size: "S", Color: "Camel" },
              prices: [
                { amount: 18900, currency_code: "usd" },
                { amount: 16900, currency_code: "eur" },
                { amount: 70900, currency_code: "sar" },
              ],
            },
            {
              title: "M / Camel",
              sku: "MERINO-SWEATER-M-CAMEL",
              options: { Size: "M", Color: "Camel" },
              prices: [
                { amount: 18900, currency_code: "usd" },
                { amount: 16900, currency_code: "eur" },
                { amount: 70900, currency_code: "sar" },
              ],
            },
            {
              title: "M / Charcoal",
              sku: "MERINO-SWEATER-M-CHARCOAL",
              options: { Size: "M", Color: "Charcoal" },
              prices: [
                { amount: 18900, currency_code: "usd" },
                { amount: 16900, currency_code: "eur" },
                { amount: 70900, currency_code: "sar" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },

        // Outerwear Products
        {
          title: "Tailored Wool Coat",
          type_id: outerwearType.id,
          description:
            "A timeless double-breasted coat in premium Italian wool. Features a refined silhouette with notched lapels and functional pockets.",
          handle: "tailored-wool-coat",
          weight: 900,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["XS", "S", "M", "L", "XL"],
            },
            {
              title: "Color",
              values: ["Camel", "Navy", "Black"],
            },
          ],
          variants: [
            {
              title: "S / Camel",
              sku: "WOOL-COAT-S-CAMEL",
              options: { Size: "S", Color: "Camel" },
              prices: [
                { amount: 49900, currency_code: "usd" },
                { amount: 44900, currency_code: "eur" },
                { amount: 187100, currency_code: "sar" },
              ],
            },
            {
              title: "M / Camel",
              sku: "WOOL-COAT-M-CAMEL",
              options: { Size: "M", Color: "Camel" },
              prices: [
                { amount: 49900, currency_code: "usd" },
                { amount: 44900, currency_code: "eur" },
                { amount: 187100, currency_code: "sar" },
              ],
            },
            {
              title: "M / Navy",
              sku: "WOOL-COAT-M-NAVY",
              options: { Size: "M", Color: "Navy" },
              prices: [
                { amount: 49900, currency_code: "usd" },
                { amount: 44900, currency_code: "eur" },
                { amount: 187100, currency_code: "sar" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Leather Bomber Jacket",
          type_id: outerwearType.id,
          description:
            "Modern interpretation of a classic bomber jacket in buttery soft lambskin leather. Features ribbed cuffs and a sleek zipper closure.",
          handle: "leather-bomber-jacket",
          weight: 700,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["XS", "S", "M", "L", "XL"],
            },
            {
              title: "Color",
              values: ["Black", "Cognac"],
            },
          ],
          variants: [
            {
              title: "S / Black",
              sku: "LEATHER-BOMBER-S-BLACK",
              options: { Size: "S", Color: "Black" },
              prices: [
                { amount: 69900, currency_code: "usd" },
                { amount: 62900, currency_code: "eur" },
                { amount: 262100, currency_code: "sar" },
              ],
            },
            {
              title: "M / Black",
              sku: "LEATHER-BOMBER-M-BLACK",
              options: { Size: "M", Color: "Black" },
              prices: [
                { amount: 69900, currency_code: "usd" },
                { amount: 62900, currency_code: "eur" },
                { amount: 262100, currency_code: "sar" },
              ],
            },
            {
              title: "M / Cognac",
              sku: "LEATHER-BOMBER-M-COGNAC",
              options: { Size: "M", Color: "Cognac" },
              prices: [
                { amount: 69900, currency_code: "usd" },
                { amount: 62900, currency_code: "eur" },
                { amount: 262100, currency_code: "sar" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },

        // Accessories
        {
          title: "Italian Leather Tote",
          type_id: accessoriesType.id,
          description:
            "Spacious leather tote handcrafted in Florence. Features interior pockets and a magnetic closure. The perfect everyday companion.",
          handle: "italian-leather-tote",
          weight: 450,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1564422170194-896b89110ef8?w=800&q=80",
            },
          ],
          options: [
            {
              title: "Color",
              values: ["Tan", "Black", "Cognac"],
            },
          ],
          variants: [
            {
              title: "Tan",
              sku: "LEATHER-TOTE-TAN",
              options: { Color: "Tan" },
              prices: [
                { amount: 32900, currency_code: "usd" },
                { amount: 29500, currency_code: "eur" },
                { amount: 123400, currency_code: "sar" },
              ],
            },
            {
              title: "Black",
              sku: "LEATHER-TOTE-BLACK",
              options: { Color: "Black" },
              prices: [
                { amount: 32900, currency_code: "usd" },
                { amount: 29500, currency_code: "eur" },
                { amount: 123400, currency_code: "sar" },
              ],
            },
            {
              title: "Cognac",
              sku: "LEATHER-TOTE-COGNAC",
              options: { Color: "Cognac" },
              prices: [
                { amount: 32900, currency_code: "usd" },
                { amount: 29500, currency_code: "eur" },
                { amount: 123400, currency_code: "sar" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Cashmere Scarf",
          type_id: accessoriesType.id,
          description:
            "Luxuriously soft cashmere scarf from Scotland. Oversized design perfect for wrapping or draping. An essential for every season.",
          handle: "cashmere-scarf",
          weight: 150,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1601924638867-2a8f9c4a7c3f?w=800&q=80",
            },
          ],
          options: [
            {
              title: "Color",
              values: ["Camel", "Charcoal", "Ivory", "Navy"],
            },
          ],
          variants: [
            {
              title: "Camel",
              sku: "CASHMERE-SCARF-CAMEL",
              options: { Color: "Camel" },
              prices: [
                { amount: 24900, currency_code: "usd" },
                { amount: 22300, currency_code: "eur" },
                { amount: 93400, currency_code: "sar" },
              ],
            },
            {
              title: "Charcoal",
              sku: "CASHMERE-SCARF-CHARCOAL",
              options: { Color: "Charcoal" },
              prices: [
                { amount: 24900, currency_code: "usd" },
                { amount: 22300, currency_code: "eur" },
                { amount: 93400, currency_code: "sar" },
              ],
            },
            {
              title: "Ivory",
              sku: "CASHMERE-SCARF-IVORY",
              options: { Color: "Ivory" },
              prices: [
                { amount: 24900, currency_code: "usd" },
                { amount: 22300, currency_code: "eur" },
                { amount: 93400, currency_code: "sar" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
      ],
    },
  });

  logger.info("Finished seeding fashion products.");
  logger.info(`Created ${3} product types: Apparel, Accessories, and Outerwear`);
  logger.info(`Created ${7} fashion products with variants`);
}
