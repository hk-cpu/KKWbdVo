// Medusa Service implemented with @medusajs/medusa-js
import Medusa from '@medusajs/medusa-js';

const DEFAULT_BASE = 'http://localhost:9000';

class MedusaService {
  constructor() {
    const baseUrl = (import.meta?.env?.VITE_MEDUSA_BACKEND_URL || DEFAULT_BASE).replace(/\/$/, '');
    this.client = new Medusa({ baseUrl, maxRetries: 3 });
  }

  async getAllProducts(limit = 24) {
    const { products } = await this.client.products.list({ limit });
    return products || [];
  }

  async getCollections(limit = 20) {
    const { collections } = await this.client.collections.list({ limit });
    return collections || [];
  }

  async getCollectionByHandle(handle) {
    const { collections } = await this.client.collections.list({ handle, limit: 1 });
    return (collections || [])[0] || null;
  }

  async getProductsByCollection(collectionId, limit = 24) {
    const { products } = await this.client.products.list({ collection_id: [collectionId], limit });
    return products || [];
  }

  async getProductByHandle(handle) {
    const { products } = await this.client.products.list({ handle });
    return (products || [])[0] || null;
  }

  async createCart() {
    const { cart } = await this.client.carts.create();
    return cart || null;
  }

  async addToCart(cartId, variantId, quantity = 1) {
    const { cart } = await this.client.carts.lineItems.create(cartId, { variant_id: variantId, quantity });
    return cart || null;
  }

  async updateLineItem(cartId, lineId, quantity) {
    const { cart } = await this.client.carts.lineItems.update(cartId, lineId, { quantity });
    return cart || null;
  }

  async removeLineItem(cartId, lineId) {
    await this.client.carts.lineItems.delete(cartId, lineId);
    const { cart } = await this.client.carts.retrieve(cartId);
    return cart || null;
  }

  async createPaymentSessions(cartId) {
    const { cart } = await this.client.carts.createPaymentSessions(cartId);
    return cart || null;
  }

  async completeCart(cartId) {
    return await this.client.carts.complete(cartId);
  }
}

export default new MedusaService();
