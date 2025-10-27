// Medusa Service implemented with direct fetch API for proper header support
import Medusa from '@medusajs/medusa-js';

const DEFAULT_BASE = 'http://localhost:9000';

class MedusaService {
	constructor() {
		const baseUrl = (import.meta?.env?.VITE_MEDUSA_BACKEND_URL || DEFAULT_BASE).replace(/\/$/, '');
		const publishableApiKey = import.meta?.env?.VITE_MEDUSA_PUBLISHABLE_KEY || 'pk_51b3045f87cdc166fc04135996ef34c61b82a0676880ae91fbb20d2c09ed5db6';

		console.log('[Medusa Service] Initializing...');
		console.log('[Medusa Service] Base URL:', baseUrl);
		console.log('[Medusa Service] API Key present:', publishableApiKey ? 'YES' : 'NO');
		console.log('[Medusa Service] API Key (first 20 chars):', publishableApiKey.substring(0, 20) + '...');

		this.baseUrl = baseUrl;
		this.apiKey = publishableApiKey;

		// Simple in-memory cache with 5 minute TTL
		this.cache = new Map();
		this.cacheTTL = 5 * 60 * 1000; // 5 minutes

		// Create client but we'll use direct fetch for all requests
		this.client = new Medusa({
			baseUrl,
			maxRetries: 3
		});
	}

	// Cache helper methods
	getCached(key) {
		const cached = this.cache.get(key);
		if (!cached) return null;

		const now = Date.now();
		if (now - cached.timestamp > this.cacheTTL) {
			this.cache.delete(key);
			return null;
		}

		console.log('[Cache] Hit:', key);
		return cached.data;
	}

	setCached(key, data) {
		this.cache.set(key, {
			data,
			timestamp: Date.now()
		});
	}

	clearCache() {
		this.cache.clear();
		console.log('[Cache] Cleared');
	}

	// Helper method to make authenticated requests with retry logic
	async makeRequest(endpoint, options = {}) {
		const url = `${this.baseUrl}${endpoint}`;
		const headers = {
			'Content-Type': 'application/json',
			'x-publishable-api-key': this.apiKey,
			...options.headers
		};

		const maxRetries = 3;
		let lastError;

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				const response = await fetch(url, {
					...options,
					headers,
					signal: AbortSignal.timeout(10000) // 10 second timeout
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				return data;
			} catch (error) {
				lastError = error;
				console.warn(`[makeRequest] Attempt ${attempt}/${maxRetries} failed:`, error.message);

				if (attempt < maxRetries) {
					// Exponential backoff: wait 500ms, 1000ms, 1500ms
					await new Promise(resolve => setTimeout(resolve, attempt * 500));
				}
			}
		}

		console.error('[makeRequest] All retries failed:', lastError);
		throw lastError;
	}

	async getAllProducts(limit = 24, lang = null) {
		// Tolgee handles translations server-side, no need to request fields
		const endpoint = `/store/products?limit=${limit}`;

		// Check cache first
		const cacheKey = `products_${limit}_${lang || 'default'}`;
		const cached = this.getCached(cacheKey);
		if (cached) return cached;

		console.log('[getAllProducts] Fetching:', endpoint);
		const data = await this.makeRequest(endpoint);
		console.log('[getAllProducts] Response:', data);

		const products = data.products || [];
		this.setCached(cacheKey, products);
		return products;
	}

	async getCollections(limit = 20, lang = null) {
		// Tolgee handles translations server-side, no need to request fields
		const endpoint = `/store/collections?limit=${limit}`;

		// Check cache
		const cacheKey = `collections_${limit}_${lang || 'default'}`;
		const cached = this.getCached(cacheKey);
		if (cached) return cached;

		const data = await this.makeRequest(endpoint);
		const collections = data.collections || [];
		this.setCached(cacheKey, collections);
		return collections;
	}

	async getCollectionByHandle(handle) {
		const data = await this.makeRequest(`/store/collections?handle=${handle}&limit=1`);
		return (data.collections || [])[0] || null;
	}

	async getProductsByCollection(collectionId, limit = 24, lang = null) {
		// Tolgee handles translations server-side, no need to request fields
		const endpoint = `/store/products?collection_id[]=${collectionId}&limit=${limit}`;

		// Check cache
		const cacheKey = `products_coll_${collectionId}_${limit}_${lang || 'default'}`;
		const cached = this.getCached(cacheKey);
		if (cached) return cached;

		const data = await this.makeRequest(endpoint);
		const products = data.products || [];
		this.setCached(cacheKey, products);
		return products;
	}

	async getProductByHandle(handle, lang = null) {
		// Tolgee handles translations server-side, no need to request fields
		const endpoint = `/store/products?handle=${handle}`;

		// Check cache
		const cacheKey = `product_${handle}_${lang || 'default'}`;
		const cached = this.getCached(cacheKey);
		if (cached) return cached;

		const data = await this.makeRequest(endpoint);
		const product = (data.products || [])[0] || null;
		if (product) {
			this.setCached(cacheKey, product);
		}
		return product;
	}

	async getProductTypes(limit = 50) {
		const data = await this.makeRequest(`/store/product-types?limit=${limit}`);
		return data.product_types || [];
	}

	async getProductsByType(typeId, limit = 24, lang = null) {
		// Tolgee handles translations server-side, no need to request fields
		const endpoint = `/store/products?type_id[]=${typeId}&limit=${limit}`;

		// Check cache
		const cacheKey = `products_type_${typeId}_${limit}_${lang || 'default'}`;
		const cached = this.getCached(cacheKey);
		if (cached) return cached;

		const data = await this.makeRequest(endpoint);
		const products = data.products || [];
		this.setCached(cacheKey, products);
		return products;
	}

	// Product Categories
	async getProductCategories(limit = 50, includeProducts = false) {
		const cacheKey = `categories_${limit}_${includeProducts}`;
		const cached = this.getCached(cacheKey);
		if (cached) return cached;

		const endpoint = `/store/product-categories?limit=${limit}&include_products=${includeProducts}`;
		const data = await this.makeRequest(endpoint);
		const categories = data.categories || [];
		this.setCached(cacheKey, categories);
		return categories;
	}

	async getProductCategory(categoryId) {
		const cacheKey = `category_${categoryId}`;
		const cached = this.getCached(cacheKey);
		if (cached) return cached;

		const endpoint = `/admin/product-categories/${categoryId}`;
		const data = await this.makeRequest(endpoint);
		const category = data.category || null;
		if (category) {
			this.setCached(cacheKey, category);
		}
		return category;
	}

	async getProductsByCategory(categoryId, limit = 24, lang = null) {
		// Tolgee handles translations server-side, no need to request fields
		const endpoint = `/store/products?category_id[]=${categoryId}&limit=${limit}`;

		// Check cache
		const cacheKey = `products_cat_${categoryId}_${limit}_${lang || 'default'}`;
		const cached = this.getCached(cacheKey);
		if (cached) return cached;

		const data = await this.makeRequest(endpoint);
		const products = data.products || [];
		this.setCached(cacheKey, products);
		return products;
	}

	// Get current region/currency (defaults to SAR for Saudi market)
	getCurrentCurrency() {
		return localStorage.getItem('medusa_currency') || 'SAR';
	}

	setCurrentCurrency(currency) {
		localStorage.setItem('medusa_currency', currency.toUpperCase());
	}

	// Format price with currency symbol
	formatPrice(amount, currency = 'SAR') {
		const value = (amount / 100).toFixed(2);
		const symbols = {
			SAR: 'ر.س',
			USD: '$',
			EUR: '€'
		};
		const symbol = symbols[currency.toUpperCase()] || currency.toUpperCase();
		return `${symbol} ${value}`;
	}

	async createCart() {
		const data = await this.makeRequest('/store/carts', { method: 'POST' });
		return data.cart || null;
	}

	async addToCart(cartId, variantId, quantity = 1) {
		const data = await this.makeRequest(`/store/carts/${cartId}/line-items`, {
			method: 'POST',
			body: JSON.stringify({ variant_id: variantId, quantity })
		});
		return data.cart || null;
	}

	async updateLineItem(cartId, lineId, quantity) {
		const data = await this.makeRequest(`/store/carts/${cartId}/line-items/${lineId}`, {
			method: 'POST',
			body: JSON.stringify({ quantity })
		});
		return data.cart || null;
	}

	async removeLineItem(cartId, lineId) {
		await this.makeRequest(`/store/carts/${cartId}/line-items/${lineId}`, { method: 'DELETE' });
		const data = await this.makeRequest(`/store/carts/${cartId}`);
		return data.cart || null;
	}

	async updateCart(cartId, cartData) {
		const data = await this.makeRequest(`/store/carts/${cartId}`, {
			method: 'POST',
			body: JSON.stringify(cartData)
		});
		return data.cart || null;
	}

	async getCart(cartId) {
		const data = await this.makeRequest(`/store/carts/${cartId}`);
		return data.cart || null;
	}

	async listShippingOptions(cartId) {
		const data = await this.makeRequest(`/store/shipping-options?cart_id=${cartId}`);
		return data.shipping_options || [];
	}

	async addShippingMethod(cartId, optionId) {
		const data = await this.makeRequest(`/store/carts/${cartId}/shipping-methods`, {
			method: 'POST',
			body: JSON.stringify({ option_id: optionId })
		});
		return data.cart || null;
	}

	async createPaymentSessions(cartId) {
		const data = await this.makeRequest(`/store/carts/${cartId}/payment-sessions`, { method: 'POST' });
		return data.cart || null;
	}

	async completeCart(cartId) {
		return await this.makeRequest(`/store/carts/${cartId}/complete`, { method: 'POST' });
	}

	// Get translated field from product/collection/etc based on current language
	getTranslatedField(item, field, lang = null) {
		// If no language specified, use current UI language
		if (!lang) {
			lang = localStorage.getItem('lang') || 'en';
		}

		// Check if item has translations for this language
		if (item.translations && item.translations[lang] && item.translations[lang][field]) {
			return item.translations[lang][field];
		}

		// Fallback to default field value
		return item[field] || '';
	}

	// Helper to get localized product title
	getProductTitle(product, lang = null) {
		return this.getTranslatedField(product, 'title', lang);
	}

	// Helper to get localized product description
	getProductDescription(product, lang = null) {
		return this.getTranslatedField(product, 'description', lang);
	}

	// Get variant price for specific currency with fallback
	getVariantPrice(variant, currency = 'SAR') {
		if (!variant || !variant.prices) return null;

		const currencyLower = currency.toLowerCase();
		const price = variant.prices.find(p => p.currency_code === currencyLower);

		// Fallback to USD if requested currency not found
		if (!price) {
			const usdPrice = variant.prices.find(p => p.currency_code === 'usd');
			return usdPrice || variant.prices[0] || null;
		}

		return price;
	}

	// Get lowest price across all variants for a product
	getLowestPrice(product, currency = 'SAR') {
		if (!product || !product.variants || product.variants.length === 0) {
			return null;
		}

		const currencyLower = currency.toLowerCase();
		const prices = product.variants
			.flatMap(v => (v.prices || []).filter(p => p.currency_code === currencyLower))
			.filter(p => p.amount > 0);

		if (prices.length === 0) {
			// Fallback to USD prices
			const usdPrices = product.variants
				.flatMap(v => (v.prices || []).filter(p => p.currency_code === 'usd'))
				.filter(p => p.amount > 0);
			return usdPrices.length > 0 ? usdPrices.reduce((min, p) => p.amount < min.amount ? p : min) : null;
		}

		return prices.reduce((min, p) => p.amount < min.amount ? p : min);
	}
}

export default new MedusaService();
