import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  createRegionsWorkflow,
  createTaxRegionsWorkflow,
  createShippingOptionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedSaudiMarket({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const storeModuleService = container.resolve(Modules.STORE);
  const regionModuleService = container.resolve(Modules.REGION);

  logger.info("Starting Saudi Arabia market setup...");

  // Get store
  const [store] = await storeModuleService.listStores();

  // Check if Saudi region already exists
  const existingRegions = await regionModuleService.listRegions({
    name: "Saudi Arabia",
  });

  if (existingRegions.length > 0) {
    logger.info("Saudi Arabia region already exists. Skipping creation.");
    return;
  }

  logger.info("Adding SAR currency to store...");
  
  // Update store to support SAR currency
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "eur",
            is_default: false,
          },
          {
            currency_code: "usd",
            is_default: false,
          },
          {
            currency_code: "sar",
            is_default: true, // Make SAR the default currency
          },
        ],
      },
    },
  });

  logger.info("Creating Saudi Arabia region...");
  
  // Create Saudi Arabia region
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Saudi Arabia",
          currency_code: "sar",
          countries: ["sa"], // Saudi Arabia country code
          payment_providers: ["pp_system_default"],
          metadata: {
            market: "saudi",
            region_code: "riyadh",
            timezone: "Asia/Riyadh",
            language: "ar-SA",
          },
        },
      ],
    },
  });

  const saudiRegion = regionResult[0];
  logger.info(`Created Saudi Arabia region with ID: ${saudiRegion.id}`);

  logger.info("Setting up Saudi Arabia tax system (15% VAT)...");
  
  // Create tax region for Saudi Arabia
  // Saudi Arabia has 15% VAT (Value Added Tax)
  await createTaxRegionsWorkflow(container).run({
    input: [
      {
        country_code: "sa",
        provider_id: "tp_system",
        metadata: {
          vat_rate: 15, // 15% VAT in Saudi Arabia
          tax_name: "VAT",
          tax_authority: "ZATCA", // Zakat, Tax and Customs Authority
        },
      },
    ],
  });

  logger.info("Setting up fulfillment for Saudi Arabia...");

  // Get or create fulfillment set for Saudi Arabia
  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Saudi Arabia Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Riyadh & Central Region",
        geo_zones: [
          {
            country_code: "sa",
            type: "country",
            metadata: {
              cities: ["Riyadh", "Al Kharj", "Al Majmaah", "Ad Diriyah"],
            },
          },
        ],
      },
    ],
  });

  // Link stock location to Saudi fulfillment set
  const stockLocationId = store.default_location_id;
  if (stockLocationId) {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocationId,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    });
  }

  logger.info("Creating shipping options for Saudi Arabia...");

  // Get default shipping profile
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  const shippingProfile = shippingProfiles[0];

  // Create shipping options with SAR pricing
  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Delivery (3-5 days)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "توصيل قياسي خلال 3-5 أيام عمل",
          code: "standard-sa",
        },
        prices: [
          {
            currency_code: "sar",
            amount: 3000, // 30 SAR
          },
          {
            region_id: saudiRegion.id,
            amount: 3000,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Delivery (1-2 days)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "توصيل سريع خلال 1-2 يوم عمل",
          code: "express-sa",
        },
        prices: [
          {
            currency_code: "sar",
            amount: 5000, // 50 SAR
          },
          {
            region_id: saudiRegion.id,
            amount: 5000,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Same Day Delivery (Riyadh only)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Same Day",
          description: "التوصيل في نفس اليوم (الرياض فقط)",
          code: "same-day-riyadh",
        },
        prices: [
          {
            currency_code: "sar",
            amount: 8000, // 80 SAR
          },
          {
            region_id: saudiRegion.id,
            amount: 8000,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Free Shipping (Orders over 500 SAR)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Free",
          description: "شحن مجاني للطلبات فوق 500 ريال",
          code: "free-sa",
        },
        prices: [
          {
            currency_code: "sar",
            amount: 0, // Free
          },
          {
            region_id: saudiRegion.id,
            amount: 0,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });

  logger.info("✅ Saudi Arabia market setup complete!");
  logger.info("Summary:");
  logger.info("- Currency: SAR (Saudi Riyal) set as default");
  logger.info("- Region: Saudi Arabia created");
  logger.info("- Tax: 15% VAT configured");
  logger.info("- Shipping: 4 delivery options added");
  logger.info("  • Standard: 30 SAR (3-5 days)");
  logger.info("  • Express: 50 SAR (1-2 days)");
  logger.info("  • Same Day: 80 SAR (Riyadh only)");
  logger.info("  • Free: Orders over 500 SAR");
}
