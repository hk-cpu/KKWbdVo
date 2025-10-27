import Medusa from "@medusajs/js-sdk"

// Initialize Medusa JS SDK v2
export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000",
  debug: import.meta.env.DEV,
  publishableKey: import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || 'pk_51b3045f87cdc166fc04135996ef34c61b82a0676880ae91fbb20d2c09ed5db6',
})

/**
 * Enhanced Medusa Service using official JS SDK v2
 * Provides type-safe methods for all store operations
 */
class MedusaSDKService {
  constructor() {
    this.sdk = sdk
    this.cache = new Map()
    this.cacheTTL = 5 * 60 * 1000 // 5 minutes
    
    console.log('[Medusa SDK] Initialized with official @medusajs/js-sdk')
  }

  // Cache helpers
  getCached(key) {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > this.cacheTTL) {
      this.cache.delete(key)
      return null
    }
    
    console.log('[SDK Cache] Hit:', key)
    return cached.data
  }

  setCached(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  clearCache() {
    this.cache.clear()
    console.log('[SDK Cache] Cleared')
  }

  // ========== PRODUCTS ==========
  
  async getAllProducts(limit = 24, offset = 0) {
    const cacheKey = `sdk_products_${limit}_${offset}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    const { products, count } = await this.sdk.store.product.list({
      limit,
      offset,
      fields: '*variants,*variants.prices,*images',
    })
    
    this.setCached(cacheKey, { products, count })
    return { products, count }
  }

  async getProductByHandle(handle) {
    const cacheKey = `sdk_product_${handle}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    const { products } = await this.sdk.store.product.list({
      handle,
      fields: '*variants,*variants.prices,*images,*options',
    })
    
    const product = products?.[0] || null
    if (product) this.setCached(cacheKey, product)
    return product
  }

  async getProductsByCollection(collectionId, limit = 24) {
    const cacheKey = `sdk_products_coll_${collectionId}_${limit}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    const { products } = await this.sdk.store.product.list({
      collection_id: [collectionId],
      limit,
      fields: '*variants,*variants.prices,*images',
    })
    
    this.setCached(cacheKey, products)
    return products
  }

  async getProductsByCategory(categoryId, limit = 24) {
    const cacheKey = `sdk_products_cat_${categoryId}_${limit}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    const { products } = await this.sdk.store.product.list({
      category_id: [categoryId],
      limit,
      fields: '*variants,*variants.prices,*images',
    })
    
    this.setCached(cacheKey, products)
    return products
  }

  // ========== COLLECTIONS ==========
  
  async getCollections(limit = 20) {
    const cacheKey = `sdk_collections_${limit}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    const { collections } = await this.sdk.store.collection.list({ limit })
    this.setCached(cacheKey, collections)
    return collections
  }

  async getCollectionByHandle(handle) {
    const { collections } = await this.sdk.store.collection.list({
      handle: [handle],
    })
    return collections?.[0] || null
  }

  // ========== CATEGORIES ==========
  
  async getProductCategories(limit = 50) {
    const cacheKey = `sdk_categories_${limit}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    const { product_categories } = await this.sdk.store.category.list({
      limit,
      fields: '*products',
    })
    
    this.setCached(cacheKey, product_categories)
    return product_categories
  }

  async getProductCategory(categoryId) {
    const cacheKey = `sdk_category_${categoryId}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    const { product_category } = await this.sdk.store.category.retrieve(categoryId, {
      fields: '*products,*products.variants,*products.images',
    })
    
    this.setCached(cacheKey, product_category)
    return product_category
  }

  // ========== CART ==========
  
  async createCart(regionId) {
    const { cart } = await this.sdk.store.cart.create({ region_id: regionId })
    return cart
  }

  async getCart(cartId) {
    const { cart } = await this.sdk.store.cart.retrieve(cartId)
    return cart
  }

  async addToCart(cartId, variantId, quantity = 1) {
    const { cart } = await this.sdk.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
    })
    return cart
  }

  async updateLineItem(cartId, lineId, quantity) {
    const { cart } = await this.sdk.store.cart.updateLineItem(cartId, lineId, {
      quantity,
    })
    return cart
  }

  async removeLineItem(cartId, lineId) {
    await this.sdk.store.cart.deleteLineItem(cartId, lineId)
    const { cart } = await this.sdk.store.cart.retrieve(cartId)
    return cart
  }

  async completeCart(cartId) {
    const response = await this.sdk.store.cart.complete(cartId)
    return response
  }

  // ========== REGIONS ==========
  
  async getRegions() {
    const { regions } = await this.sdk.store.region.list()
    return regions
  }

  // ========== HELPERS ==========
  
  getCurrentCurrency() {
    return localStorage.getItem('medusa_currency') || 'SAR'
  }

  setCurrentCurrency(currency) {
    localStorage.setItem('medusa_currency', currency.toUpperCase())
  }

  formatPrice(amount, currency = 'SAR') {
    const value = (amount / 100).toFixed(2)
    const symbols = {
      SAR: 'ر.س',
      USD: '$',
      EUR: '€'
    }
    const symbol = symbols[currency.toUpperCase()] || currency.toUpperCase()
    return `${symbol} ${value}`
  }

  getLowestPrice(product, currency = 'SAR') {
    if (!product || !product.variants || product.variants.length === 0) {
      return null
    }

    const currencyLower = currency.toLowerCase()
    const prices = product.variants
      .flatMap(v => (v.prices || []).filter(p => p.currency_code === currencyLower))
      .filter(p => p.amount > 0)

    if (prices.length === 0) {
      const usdPrices = product.variants
        .flatMap(v => (v.prices || []).filter(p => p.currency_code === 'usd'))
        .filter(p => p.amount > 0)
      return usdPrices.length > 0 ? usdPrices.reduce((min, p) => p.amount < min.amount ? p : min) : null
    }

    return prices.reduce((min, p) => p.amount < min.amount ? p : min)
  }

  // Translation helpers (compatible with Tolgee)
  getTranslatedField(item, field, lang = null) {
    if (!lang) {
      lang = localStorage.getItem('lang') || 'en'
    }
    
    if (item.translations && item.translations[lang] && item.translations[lang][field]) {
      return item.translations[lang][field]
    }
    
    return item[field] || ''
  }

  getProductTitle(product, lang = null) {
    return this.getTranslatedField(product, 'title', lang)
  }

  getProductDescription(product, lang = null) {
    return this.getTranslatedField(product, 'description', lang)
  }
}

// Export singleton instance
export const medusaSDK = new MedusaSDKService()
export default medusaSDK
