# Medusa JS SDK v2 Upgrade Guide

## 🎉 What's New

Your FORMÉ HAUS storefront now supports the **official Medusa JS SDK v2** (`@medusajs/js-sdk`), which provides:

✅ **Type Safety** - Full TypeScript support  
✅ **Better Performance** - Optimized API calls  
✅ **Cleaner Code** - Simplified method signatures  
✅ **Official Support** - Maintained by Medusa team  
✅ **Auto-completion** - IntelliSense in VS Code  

## 📦 Installation

Already installed! The SDK is now available in your project:

```bash
npm install @medusajs/js-sdk
```

## 🔄 Two Services Available

You now have **TWO** service options:

### 1. Legacy Service (Current)
**File**: `medusa-service.js`
- Uses direct `fetch()` calls
- Compatible with all existing code
- **No changes needed** - your storefront still works!

### 2. New SDK Service (Recommended)
**File**: `medusa-sdk.js`
- Uses official `@medusajs/js-sdk`
- Type-safe methods
- Modern async/await patterns

## 🚀 Quick Start

### Import the New SDK Service

```javascript
// Old way (still works)
import medusaService from './medusa-service.js'

// New way (recommended)
import { medusaSDK } from './medusa-sdk.js'
```

### Usage Examples

#### Get All Products

```javascript
// Old service
const products = await medusaService.getAllProducts(24)

// New SDK
const { products, count } = await medusaSDK.getAllProducts(24)
console.log(`Showing ${products.length} of ${count} products`)
```

#### Get Product by Handle

```javascript
// Old service
const product = await medusaService.getProductByHandle('silk-drape-blouse')

// New SDK
const product = await medusaSDK.getProductByHandle('silk-drape-blouse')
```

#### Get Product Category

```javascript
// Old service
const category = await medusaService.getProductCategory('pcat_123')

// New SDK (type-safe!)
const category = await medusaSDK.getProductCategory('pcat_123')
console.log(category.name, category.products)
```

## 📚 Complete API Reference

### Products

```javascript
// List products
const { products, count } = await medusaSDK.getAllProducts(24, 0)

// Get by handle
const product = await medusaSDK.getProductByHandle('leather-bomber-jacket')

// Get by collection
const products = await medusaSDK.getProductsByCollection('coll_123', 24)

// Get by category
const products = await medusaSDK.getProductsByCategory('pcat_123', 24)
```

### Collections

```javascript
// List collections
const collections = await medusaSDK.getCollections(20)

// Get by handle
const collection = await medusaSDK.getCollectionByHandle('womens-apparel')
```

### Categories

```javascript
// List categories
const categories = await medusaSDK.getProductCategories(50)

// Get single category with products
const category = await medusaSDK.getProductCategory('pcat_123')
console.log(category.products) // All products in category
```

### Cart

```javascript
// Create cart
const cart = await medusaSDK.createCart('reg_123')

// Add item
const updatedCart = await medusaSDK.addToCart(cart.id, 'variant_123', 2)

// Update quantity
const cart2 = await medusaSDK.updateLineItem(cart.id, 'line_123', 3)

// Remove item
const cart3 = await medusaSDK.removeLineItem(cart.id, 'line_123')

// Complete checkout
const order = await medusaSDK.completeCart(cart.id)
```

### Regions

```javascript
// Get all regions
const regions = await medusaSDK.getRegions()
console.log(regions) // [{ id: 'reg_sa', name: 'Saudi Arabia', currency_code: 'sar' }]
```

### Helper Methods

```javascript
// Currency
medusaSDK.getCurrentCurrency() // 'SAR'
medusaSDK.setCurrentCurrency('USD')

// Price formatting
const formatted = medusaSDK.formatPrice(12900, 'SAR') // 'ر.س 129.00'

// Get lowest price
const price = medusaSDK.getLowestPrice(product, 'SAR')
console.log(medusaSDK.formatPrice(price.amount, 'SAR'))

// Translations
const title = medusaSDK.getProductTitle(product, 'ar')
const description = medusaSDK.getProductDescription(product, 'en')
```

## 🔄 Migration Path

### Option 1: Gradual Migration (Recommended)

Keep both services and migrate page by page:

```javascript
// collections.html - migrated to SDK
import { medusaSDK } from './medusa-sdk.js'

async function loadProducts() {
  const { products } = await medusaSDK.getAllProducts(24)
  renderProducts(products)
}
```

```javascript
// product.html - still using old service
import medusaService from './medusa-service.js'

async function loadProduct(handle) {
  const product = await medusaService.getProductByHandle(handle)
  renderProduct(product)
}
```

### Option 2: Full Migration

Replace all imports at once:

```javascript
// Find and replace across all files
// OLD: import medusaService from './medusa-service.js'
// NEW: import { medusaSDK as medusaService } from './medusa-sdk.js'
```

## 🎯 Use Cases

### 1. Product Listing Page

```javascript
import { medusaSDK } from './medusa-sdk.js'

async function renderShop() {
  const { products, count } = await medusaSDK.getAllProducts(24, 0)
  
  const grid = document.getElementById('product-grid')
  grid.innerHTML = products.map(product => {
    const price = medusaSDK.getLowestPrice(product, 'SAR')
    return `
      <div class="product-card">
        <img src="${product.thumbnail}" alt="${product.title}">
        <h3>${medusaSDK.getProductTitle(product)}</h3>
        <p>${medusaSDK.formatPrice(price.amount, 'SAR')}</p>
      </div>
    `
  }).join('')
  
  console.log(`Showing ${products.length} of ${count} products`)
}
```

### 2. Category Navigation

```javascript
async function renderCategoryMenu() {
  const categories = await medusaSDK.getProductCategories(50)
  
  const menu = document.getElementById('category-menu')
  menu.innerHTML = categories.map(cat => `
    <a href="/collections.html?category=${cat.id}">
      ${cat.name}
      <span>(${cat.products?.length || 0})</span>
    </a>
  `).join('')
}
```

### 3. Product Detail Page

```javascript
const urlParams = new URLSearchParams(window.location.search)
const handle = urlParams.get('handle')

const product = await medusaSDK.getProductByHandle(handle)

document.getElementById('product-title').textContent = medusaSDK.getProductTitle(product)
document.getElementById('product-description').textContent = medusaSDK.getProductDescription(product)

const price = medusaSDK.getLowestPrice(product, medusaSDK.getCurrentCurrency())
document.getElementById('product-price').textContent = medusaSDK.formatPrice(price.amount, price.currency_code.toUpperCase())
```

### 4. Add to Cart

```javascript
async function handleAddToCart(variantId, quantity) {
  let cartId = localStorage.getItem('cart_id')
  
  if (!cartId) {
    // Create new cart
    const cart = await medusaSDK.createCart('reg_01SAUDI')
    cartId = cart.id
    localStorage.setItem('cart_id', cartId)
  }
  
  // Add item
  const updatedCart = await medusaSDK.addToCart(cartId, variantId, quantity)
  
  // Update UI
  updateCartCount(updatedCart.items.length)
}
```

## 🔧 Advanced Features

### Direct SDK Access

You can access the raw SDK for advanced use cases:

```javascript
import { sdk } from './medusa-sdk.js'

// Use any SDK method
const { product_categories } = await sdk.store.category.list({
  fields: '*products,*products.variants',
  limit: 10
})

// Admin API (requires authentication)
const { product_category } = await sdk.admin.productCategory.retrieve('pcat_123')
```

### Custom Fields

```javascript
const { products } = await sdk.store.product.list({
  fields: '*variants.prices,*images,*options,*tags',
  limit: 20
})
```

### Filtering

```javascript
const { products } = await sdk.store.product.list({
  collection_id: ['coll_123', 'coll_456'],
  category_id: ['pcat_789'],
  limit: 50
})
```

## ⚡ Performance Benefits

### Caching

Both services include 5-minute caching:

```javascript
// First call - fetches from API
const products1 = await medusaSDK.getAllProducts(24)

// Second call within 5 min - returns from cache
const products2 = await medusaSDK.getAllProducts(24) // Instant!

// Clear cache manually
medusaSDK.clearCache()
```

### Optimized Queries

The SDK automatically optimizes queries:

```javascript
// Old way - multiple requests
const products = await fetch('/store/products')
const variants = await fetch('/store/products/variants')
const prices = await fetch('/store/products/variants/prices')

// New way - single optimized request
const { products } = await medusaSDK.getAllProducts(24)
// products[0].variants[0].prices already included!
```

## 🐛 Troubleshooting

### Issue: SDK not found

```bash
npm install @medusajs/js-sdk
```

### Issue: Import errors

Make sure to use ES modules:

```javascript
// ✅ Correct
import { medusaSDK } from './medusa-sdk.js'

// ❌ Wrong
const { medusaSDK } = require('./medusa-sdk.js')
```

### Issue: Type errors in TypeScript

Install type definitions:

```bash
npm install --save-dev @types/node
```

## 📊 Comparison

| Feature | Old Service | New SDK |
|---------|------------|---------|
| **Type Safety** | ❌ No | ✅ Yes |
| **Auto-complete** | ❌ Limited | ✅ Full |
| **Performance** | ⚠️ Good | ✅ Better |
| **Maintenance** | ⚠️ Manual | ✅ Official |
| **Caching** | ✅ Yes | ✅ Yes |
| **Error Handling** | ✅ Yes | ✅ Enhanced |
| **Bundle Size** | ✅ Smaller | ⚠️ Slightly larger |

## 🎓 Best Practices

1. **Use SDK for new code** - Start using `medusaSDK` for all new features
2. **Migrate gradually** - No rush to change existing working code
3. **Cache wisely** - Clear cache when data changes
4. **Handle errors** - Always use try-catch
5. **Type everything** - Use TypeScript for better DX

## 📝 Example Migration

### Before (Old Service)

```javascript
import medusaService from './medusa-service.js'

async function loadProducts() {
  try {
    const products = await medusaService.getAllProducts(24, 'en')
    const grid = document.getElementById('grid')
    
    grid.innerHTML = products.map(p => {
      const currency = medusaService.getCurrentCurrency()
      const amounts = p.variants.flatMap(v => 
        v.prices.filter(pr => pr.currency_code === currency.toLowerCase())
      )
      const lowest = amounts.reduce((m, a) => a.amount < m.amount ? a : m, amounts[0])
      
      return `
        <div>${p.title} - ${medusaService.formatPrice(lowest.amount, currency)}</div>
      `
    }).join('')
  } catch (error) {
    console.error('Failed:', error)
  }
}
```

### After (New SDK)

```javascript
import { medusaSDK } from './medusa-sdk.js'

async function loadProducts() {
  try {
    const { products } = await medusaSDK.getAllProducts(24)
    const grid = document.getElementById('grid')
    const currency = medusaSDK.getCurrentCurrency()
    
    grid.innerHTML = products.map(p => {
      const price = medusaSDK.getLowestPrice(p, currency)
      return `
        <div>${p.title} - ${medusaSDK.formatPrice(price.amount, currency)}</div>
      `
    }).join('')
  } catch (error) {
    console.error('Failed:', error)
  }
}
```

## 🎉 Summary

You now have access to the **official Medusa JS SDK v2**!

✅ **Both services work** - Choose what's best for each use case  
✅ **No breaking changes** - Existing code still works  
✅ **Better developer experience** - Type safety & auto-complete  
✅ **Production ready** - Used by Medusa's official storefronts  

Start using `medusaSDK` for new features and enjoy the improved developer experience! 🚀

## 📚 Official Documentation

- [Medusa JS SDK](https://docs.medusajs.com/js-sdk)
- [Store API Reference](https://docs.medusajs.com/api/store)
- [Admin API Reference](https://docs.medusajs.com/api/admin)
