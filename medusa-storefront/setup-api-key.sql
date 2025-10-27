-- Create a publishable API key for Medusa V2 Store API
-- This key will be used by the storefront to authenticate API requests

INSERT INTO publishable_api_key (id, created_by, token, title, created_at, updated_at)
VALUES (
  'pk_01JQWE7X3NMCJBX4F5T7R8Y9Z0',
  'admin',
  'pk_development_store_key_12345',
  'Development Store Key',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Output the key
SELECT 'Publishable API Key created successfully!' as message;
SELECT 'Token: pk_development_store_key_12345' as api_key;
SELECT 'Add this to your .env.local file:' as instruction;
SELECT 'VITE_MEDUSA_PUBLISHABLE_KEY=pk_development_store_key_12345' as env_var;
