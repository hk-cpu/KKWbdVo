import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Helper function to parse CORS origins
const parseCorsOrigins = (corsEnvVar: string | undefined, defaultOrigins: string[]) => {
  if (!corsEnvVar) {
    return defaultOrigins
  }
  
  return corsEnvVar.split(',').map((origin) => origin.trim())
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: parseCorsOrigins(process.env.STORE_CORS, ["http://localhost:3000"]),
      adminCors: parseCorsOrigins(process.env.ADMIN_CORS, ["http://localhost:3000"]),
      authCors: parseCorsOrigins(process.env.AUTH_CORS, ["http://localhost:3000"]),
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  plugins: [
    {
      resolve: `medusa-plugin-tolgee`,
      options: {
        baseURL: process.env.TOLGEE_API_URL || "https://app.tolgee.io",
        apiKey: process.env.TOLGEE_API_KEY,
        projectId: process.env.TOLGEE_PROJECT_ID,
        ttl: 1000 * 60 * 5, // 5 minutes cache
        rateLimit: {
          maxRequests: 15,
          perMilliseconds: 3000
        },
        batchingDelayMilliseconds: 50,
        keys: {
          product: ["title", "subtitle", "description"],
          product_collection: ["title"],
          product_category: ["name", "description"],
          product_variant: ["title"],
          product_option: ["title"],
          product_type: ["value"],
          product_tag: ["value"],
          shipping_option: ["name"]
        },
        tags: {
          product: ["forme_haus"],
          product_collection: ["forme_haus"]
        }
      }
    }
  ]
})