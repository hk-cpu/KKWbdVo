import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  createInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedInventory({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const storeModuleService = container.resolve(Modules.STORE);

  logger.info("Seeding inventory levels for all products...");

  const [store] = await storeModuleService.listStores();
  const stockLocationId = store.default_location_id;

  if (!stockLocationId) {
    logger.error("No default stock location found for store.");
    return;
  }

  // Get all inventory items
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  logger.info(`Found ${inventoryItems.length} inventory items.`);

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocationId,
      stocked_quantity: 100, // Set stock quantity
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info(`Finished seeding inventory levels for ${inventoryLevels.length} items.`);
}
