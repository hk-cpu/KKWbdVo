import postgres from "@medusajs/medusa/dist/loaders/postgres"
import { MedusaContainer } from "@medusajs/framework/types"

async function createPublishableKey() {
  try {
    // Connect to the database
    const { Pool } = await import('pg')
    const pool = new Pool({
      host: 'localhost',
      port: 5432,
      user: 'medusa',
      password: 'medusa',
      database: 'medusa'
    })

    const token = 'pk_development_store_key_12345'
    
    // Create the publishable API key
    const query = `
      INSERT INTO publishable_api_key (id, created_by, token, title, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (token) DO UPDATE SET updated_at = NOW()
      RETURNING *;
    `
    
    const result = await pool.query(query, [
      'pk_01JQWE7X3NMCJBX4F5T7R8Y9Z0',
      'admin',
      token,
      'Development Store Key'
    ])

    console.log('\n✅ Publishable API Key created successfully!')
    console.log('\nKey Details:')
    console.log('Token:', token)
    console.log('\nAdd this to your .env.local file:')
    console.log(`VITE_MEDUSA_PUBLISHABLE_KEY=${token}`)
    
    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('Error:', error.message)
    console.error('\nAlternative: Use the Medusa Admin dashboard to create a publishable API key')
    console.error('1. Open http://localhost:7001/app')
    console.error('2. Login with admin@medusa-test.com / supersecret')
    console.error('3. Go to Settings > Publishable API Keys')
    console.error('4. Create a new key and copy the token')
    process.exit(1)
  }
}

createPublishableKey()
