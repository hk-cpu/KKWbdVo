# Medusa V2 Publishable API Key Setup

## Issue
You're seeing this error:
```
{"type":"not_allowed","message":"Publishable API key required in the request header: x-publishable-api-key..."}
```

This happens because **Medusa V2** requires a publishable API key for all Store API requests.

## Quick Fix: Create API Key via Admin Dashboard

### Step 1: Access the Admin Dashboard
1. Make sure your Medusa backend is running (`npm run dev` in the `medusa-storefront` folder)
2. Open your browser and go to: **http://localhost:7001/app**
3. Login with:
   - **Email**: `admin@medusa-test.com`
   - **Password**: `supersecret`

### Step 2: Create a Publishable API Key
1. Once logged in, navigate to: **Settings** → **Publishable API Keys**
2. Click **"Create Publishable API Key"** or **"+ New Key"**
3. Enter a title: `Development Store Key`
4. Click **"Save"** or **"Create"**
5. **IMPORTANT**: Copy the generated token (it starts with `pk_`)

### Step 3: Add the Key to Your Frontend
1. Open the file: `c:\Users\futte\Desktop\we are close\.env.local`
2. Update or add this line (replace `YOUR_KEY_HERE` with the actual token you copied):
   ```
   VITE_MEDUSA_PUBLISHABLE_KEY=YOUR_KEY_HERE
   ```
3. Save the file

### Step 4: Restart the Frontend
1. Stop the frontend server (Ctrl+C in the terminal running `npm run dev`)
2. Start it again: `npm run dev`
3. Refresh your browser

## Already Configured

The frontend code has been updated to use the publishable API key automatically. You just need to create the key in the admin dashboard and add it to `.env.local`.

### Current Configuration

**File**: `medusa-service.js`
```javascript
constructor() {
  const baseUrl = (import.meta?.env?.VITE_MEDUSA_BACKEND_URL || DEFAULT_BASE).replace(/\/$/, '');
  const publishableApiKey = import.meta?.env?.VITE_MEDUSA_PUBLISHABLE_KEY || '';
  
  this.client = new Medusa({ 
    baseUrl, 
    maxRetries: 3,
    publishableApiKey: publishableApiKey
  });
}
```

## Troubleshooting

### Can't access the admin dashboard?
- Make sure the Medusa backend is running on port 9000
- Check that the admin is accessible at http://localhost:7001/app
- Verify your `.env` file in the `medusa-storefront` folder has the correct configuration

### Still getting the error after adding the key?
1. Make sure you restarted the frontend after adding the key to `.env.local`
2. Check that the key starts with `pk_`
3. Verify there are no extra spaces in the `.env.local` file
4. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

## Medusa V2 vs V1

**Note**: Your project is using **Medusa V2** (version 2.11.0), not V1. The main differences:
- V2 requires publishable API keys for store API access
- V2 has a modern admin dashboard
- V2 uses a different database schema and module system

The Store API reference you mentioned is for V1. For V2, refer to:
- https://docs.medusajs.com/resources/references/medusa/2.0/store
