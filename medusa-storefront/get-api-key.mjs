import pg from 'pg';
const { Pool } = pg;

async function getPublishableKey() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'medusa',
    password: 'medusa',
    database: 'medusa'
  });

  try {
    // Check if any publishable keys exist
    const result = await pool.query('SELECT * FROM api_key WHERE type = \'publishable\' LIMIT 10');
    
    if (result.rows.length > 0) {
      console.log('\n✅ Found existing publishable API keys:\n');
      result.rows.forEach((key, index) => {
        console.log(`${index + 1}. Title: ${key.title}`);
        console.log(`   Token: ${key.token}\n`);
      });
      
      const firstKey = result.rows[0].token;
      console.log('📋 Add this to your .env.local file:');
      console.log(`VITE_MEDUSA_PUBLISHABLE_KEY=${firstKey}\n`);
      
      await pool.end();
      return firstKey;
    } else {
      console.log('\nNo existing keys found. Creating a new one...\n');
      
      const token = 'pk_01JRDEV1234567890ABCDEFGH';
      const insertQuery = `
        INSERT INTO api_key (id, created_by, token, title, type, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *;
      `;
      
      const newKey = await pool.query(insertQuery, [
        'pak_dev_key_001',
        'admin',
        token,
        'Development Store Key',
        'publishable'
      ]);
      
      console.log('✅ Created new publishable API key!');
      console.log(`Token: ${token}\n`);
      console.log('📋 Add this to your .env.local file:');
      console.log(`VITE_MEDUSA_PUBLISHABLE_KEY=${token}\n`);
      
      await pool.end();
      return token;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

getPublishableKey().then(token => {
  process.exit(0);
});
