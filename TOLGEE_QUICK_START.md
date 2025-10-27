# FORMÉ HAUS - Tolgee Quick Start Guide

## ✅ What's Already Done

Your Tolgee integration is **95% complete**! Here's what's already configured:

### Backend (Medusa)
- ✅ `medusa-plugin-tolgee` installed
- ✅ Configuration in `medusa-storefront/medusa-config.ts`
- ✅ Environment variables ready in `medusa-storefront/.env`
- ✅ Translation support for: products, collections, categories, variants, options, types, tags, shipping options

### Frontend
- ✅ `medusa-service.js` updated with translation helpers
- ✅ `script.js` fetches products with current language
- ✅ Language toggle reloads products with translations
- ✅ Works seamlessly with existing `i18n.js`

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Free Tolgee Account
```
1. Go to: https://app.tolgee.io
2. Sign up (free for up to 500 keys)
3. Create project: "FORMÉ HAUS"
4. Add languages: English (en) + Arabic (ar)
```

### Step 2: Get Your Credentials

**Project ID:**
- Look at URL: `https://app.tolgee.io/projects/YOUR_PROJECT_ID`
- Copy the ID (e.g., `12345`)

**API Key:**
- Go to: `/account/apiKeys` in Tolgee
- Click "Create new API key"
- Name it: "FORMÉ HAUS Medusa"
- Copy the generated key (starts with `tgpak_`)

### Step 3: Update Environment File

Edit `medusa-storefront/.env`:
```env
# Replace these placeholders with your actual values
TOLGEE_API_KEY=tgpak_xxxxxxxxxxxxx
TOLGEE_PROJECT_ID=12345
```

### Step 4: Restart Backend
```bash
cd medusa-storefront
npm run dev
```

### Step 5: Sync Your Products

1. Open Medusa Admin: http://localhost:9000/app
2. Click any product
3. Scroll to **"Translations"** section
4. Click **"Sync all"** button
5. Wait ~30 seconds for sync to complete

### Step 6: Add Arabic Translations

1. Go to Tolgee dashboard: https://app.tolgee.io
2. Select your "FORMÉ HAUS" project
3. You'll see all product titles/descriptions
4. Click any item → Add Arabic translation
5. Save

**Done!** Translations now appear automatically when users switch language.

## 📖 How It Works

### Frontend Usage (Already Implemented)

```javascript
// Your language toggle already does this:
langToggle.addEventListener('change', async (e) => {
    const newLang = e.target.checked ? 'ar' : 'en';
    switchLang(newLang);
    
    // Products reload with translations
    await renderCollectionsProducts();
    await loadFeaturedProducts();
});
```

### Translation Display
```javascript
// Automatic via helper methods:
const title = medusaService.getProductTitle(product); 
// Returns Arabic if lang='ar', English otherwise

const description = medusaService.getProductDescription(product);
// Same logic for descriptions
```

### What Gets Translated

| Model | Fields |
|-------|--------|
| Products | title, subtitle, description |
| Collections | title |
| Categories | name, description |
| Variants | title |
| Options | title |
| Types | value |
| Tags | value |
| Shipping Options | name |

## 💡 Workflow

```
Add Product in Medusa Admin
         ↓
   Click "Sync all"
         ↓
Tolgee creates translation keys
         ↓
Add Arabic in Tolgee dashboard
         ↓
Frontend fetches translations
         ↓
User sees content in their language
```

## 🎯 Testing

1. **Start servers** (if not running):
   ```bash
   # Terminal 1: Backend
   cd medusa-storefront
   npm run dev
   
   # Terminal 2: Frontend
   cd ..
   npm run dev
   ```

2. **Open frontend**: http://localhost:5176

3. **Switch language**: Click EN/AR toggle

4. **Check products**: Titles should change to Arabic (if translations added)

## 🔧 Troubleshooting

### "Translations section not showing in admin?"
- Restart Medusa backend
- Clear browser cache
- Check `medusa-config.ts` has plugin config

### "Products not loading?"
- Check API key in `.env`
- Look at browser console for errors
- Verify publishable key is set

### "Translations not appearing?"
- Click "Sync all" in admin
- Add translations in Tolgee dashboard
- Reload frontend page

### "Rate limit errors?"
Free tier: 15 requests/3 seconds
- Increase cache TTL in config
- Consider self-hosting for production

## 🌟 Features You Get

- ✨ **In-context editing**: ALT+Click to edit translations
- ✨ **AI translations**: DeepL, Google, AWS integration
- ✨ **Team collaboration**: Review/approve workflow
- ✨ **Version history**: Track translation changes
- ✨ **Batch operations**: Translate multiple items at once
- ✨ **Screenshot context**: Visual context for translators

## 📚 Resources

- **Tolgee Docs**: https://docs.tolgee.io/
- **Medusa Plugin**: https://medusajs.com/integrations/medusa-plugin-tolgee/
- **Full Setup Guide**: `./TOLGEE_SETUP.md`
- **Your Config**: `medusa-storefront/medusa-config.ts`

## 🎉 Next Steps

1. ✅ Create Tolgee account (5 min)
2. ✅ Add credentials to `.env` (1 min)
3. ✅ Restart backend (1 min)
4. ✅ Sync products (1 min)
5. ✅ Add Arabic translations (2 min)
6. ✅ Test on frontend (1 min)

**Total time: ~11 minutes to full multilingual e-commerce!**

---

**FORMÉ HAUS** - Now speaking your customer's language 🌍✨
