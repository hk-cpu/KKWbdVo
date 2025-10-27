import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";

export default async function getPublishableKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const apiKeyModuleService = container.resolve(Modules.API_KEY);

  logger.info("Fetching publishable API key...");

  const apiKeys = await apiKeyModuleService.listApiKeys({
    type: "publishable",
  });

  if (apiKeys.length === 0) {
    logger.error("No publishable API key found!");
    logger.info("Please run the seed script first to create API keys.");
    return;
  }

  const publishableKey = apiKeys[0];
  
  logger.info("==================================================");
  logger.info("📌 PUBLISHABLE API KEY:");
  logger.info(publishableKey.token);
  logger.info("==================================================");
  logger.info("");
  logger.info("Add this to your frontend .env.local file:");
  logger.info(`VITE_MEDUSA_PUBLISHABLE_KEY=${publishableKey.token}`);
  logger.info("==================================================");
}
