# Product Categories - FORMÉ HAUS

Complete implementation of product category management for the FORMÉ HAUS e-commerce platform.

## 📋 Overview

Product categories provide hierarchical organization for your luxury fashion products. This implementation includes:

- ✅ Custom API routes (Admin & Store)
- ✅ Frontend service methods
- ✅ Caching for performance
- ✅ Hierarchical category trees
- ✅ Product filtering by category

## 🗂️ API Routes

### Store API - Get All Categories

**Endpoint**: `GET /store/product-categories`

**Query Parameters**:
- `limit` (number, default: 50) - Max categories to return
- `offset` (number, default: 0) - Pagination offset
- `include_products` (boolean, default: false) - Include product data

**Response**:
```json
{
  "categories": [
    {
      "id": "pcat_01HXX",
      "name": "Women's Apparel",
      "handle": "womens-apparel",
      "description": "Luxury women's clothing",
      "is_active": true,
      "rank": 0,
      "product_count": 15,
      "children": [
        {
          "id": "pcat_01HYY",
          "name": "Dresses",
          "handle": "dresses",
          "product_count": 5
        }
      ]
    }
  ],
  "count": 10,
  "offset": 0,
  "limit": 50
}
```

**Example Usage**:
```bash
# Get all categories
curl http://localhost:9000/store/product-categories

# Get categories with products
curl "http://localhost:9000/store/product-categories?include_products=true"

# Pagination
curl "http://localhost:9000/store/product-categories?limit=10&offset=0"
```

### Admin API - Get Category by ID

**Endpoint**: `GET /admin/product-categories/{id}`

**Response**:
```json
{
  "category": {
    "id": "pcat_01HXX",
    "name": "Women's Apparel",
    "handle": "womens-apparel",
    "description": "Luxury women's clothing collection",
    "is_active": true,
    "parent_category_id": null,
    "rank": 0,
    "metadata": {
      "seasonal": true,
      "featured": true
    },
    "product_count": 15,
    "products": [...]
  }
}
```

**Example Usage**:
```bash
# Get specific category
curl http://localhost:9000/admin/product-categories/pcat_01HXX
```

## 💻 Frontend Integration

### Service Methods

The `medusaService.js` now includes category methods:

#### 1. Get All Categories
```javascript
const categories = await medusaService.getProductCategories(50, false);
// Returns array of category objects
```

#### 2. Get Category by ID
```javascript
const category = await medusaService.getProductCategory('pcat_01HXX');
// Returns single category with products
```

#### 3. Get Products by Category
```javascript
const products = await medusaService.getProductsByCategory('pcat_01HXX', 24, 'en');
// Returns products in category with translations
```

### Usage Examples

#### Display Category Navigation
```javascript
async function renderCategoryMenu() {
  const categories = await medusaService.getProductCategories();
  
  const menuHTML = categories.map(category => `
    <div class="category-group">
      <h3>${category.name}</h3>
      <span class="count">(${category.product_count})</span>
      ${category.children.length > 0 ? `
        <ul class="subcategories">
          ${category.children.map(child => `
            <li>
              <a href="/collections.html?category=${child.id}">
                ${child.name} (${child.product_count})
              </a>
            </li>
          `).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('');
  
  document.getElementById('category-menu').innerHTML = menuHTML;
}
```

#### Filter Products by Category
```javascript
async function loadProductsByCategory(categoryId) {
  const currentLang = localStorage.getItem('lang') || 'en';
  const products = await medusaService.getProductsByCategory(categoryId, 24, currentLang);
  
  const grid = document.getElementById('shop-products-grid');
  grid.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.images[0]?.url}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p class="price">${formatPrice(product)}</p>
    </div>
  `).join('');
}
```

## 🏗️ Category Structure

### Recommended Hierarchy for FORMÉ HAUS

```
Women's Fashion
├── Apparel
│   ├── Dresses
│   ├── Tops & Blouses
│   ├── Trousers & Pants
│   └── Skirts
├── Outerwear
│   ├── Coats
│   ├── Jackets
│   └── Blazers
└── Accessories
    ├── Bags & Handbags
    ├── Scarves & Shawls
    └── Jewelry

Men's Fashion
├── Apparel
│   ├── Shirts
│   ├── Trousers
│   └── Suits
├── Outerwear
│   └── Jackets
└── Accessories

Seasonal Collections
├── Spring/Summer 2024
└── Fall/Winter 2024
```

## 🔧 Implementation Files

| File | Purpose |
|------|---------|
| `src/api/store/product-categories/route.ts` | Store API - List categories |
| `src/api/admin/product-categories/[id]/route.ts` | Admin API - Get category |
| `medusa-service.js` | Frontend service methods |

## 📝 Creating Categories

### Via Admin Dashboard

1. Go to http://localhost:9000/app
2. Navigate to **Products** → **Categories**
3. Click **Create Category**
4. Fill in:
   - Name: "Women's Apparel"
   - Handle: "womens-apparel"
   - Description: "Luxury women's clothing collection"
   - Active: ✓
5. Add metadata (optional):
   ```json
   {
     "seasonal": true,
     "featured": true,
     "market": "saudi_arabia"
   }
   ```

### Programmatically

Create a seed script for categories:

```typescript
// src/scripts/seed-categories.ts
import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function seedCategories({ container }: ExecArgs) {
  const productCategoryService = container.resolve(Modules.PRODUCT);
  
  // Create parent category
  const womensCategory = await productCategoryService.createProductCategories({
    name: "Women's Fashion",
    handle: "womens-fashion",
    description: "Luxury women's fashion collection",
    is_active: true,
    metadata: { featured: true }
  });
  
  // Create child categories
  await productCategoryService.createProductCategories({
    name: "Apparel",
    handle: "womens-apparel",
    description: "Women's clothing",
    parent_category_id: womensCategory.id,
    is_active: true,
  });
}
```

Run: `npx medusa exec ./src/scripts/seed-categories.ts`

## 🎨 Frontend UI Examples

### Category Filter Sidebar

```html
<aside class="category-sidebar">
  <h2>Categories</h2>
  <div id="category-tree"></div>
</aside>

<script>
async function renderCategoryTree() {
  const categories = await medusaService.getProductCategories(50, true);
  const tree = document.getElementById('category-tree');
  
  tree.innerHTML = categories.map(cat => `
    <div class="category-item ${cat.children.length > 0 ? 'has-children' : ''}">
      <a href="#" onclick="filterByCategory('${cat.id}')">
        ${cat.name}
        <span class="badge">${cat.product_count}</span>
      </a>
      ${cat.children.length > 0 ? `
        <ul class="subcategories">
          ${cat.children.map(child => `
            <li>
              <a href="#" onclick="filterByCategory('${child.id}')">
                ${child.name}
                <span class="badge">${child.product_count}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('');
}
</script>
```

### Breadcrumb Navigation

```javascript
async function renderBreadcrumb(categoryId) {
  const category = await medusaService.getProductCategory(categoryId);
  const breadcrumb = document.getElementById('breadcrumb');
  
  breadcrumb.innerHTML = `
    <a href="/">Home</a> / 
    <a href="/collections.html">Shop</a> / 
    <span>${category.name}</span>
  `;
}
```

## 🚀 Performance

### Caching Strategy

All category methods use the built-in caching system:
- **TTL**: 5 minutes
- **Cache Keys**: 
  - `categories_{limit}_{includeProducts}`
  - `category_{categoryId}`
  - `products_cat_{categoryId}_{limit}_{lang}`

### Manual Cache Clear

```javascript
// Clear all caches
medusaService.clearCache();

// Refresh categories
const categories = await medusaService.getProductCategories();
```

## 📊 Analytics & Metadata

### Track Popular Categories

Add custom metadata to track usage:

```json
{
  "view_count": 1250,
  "conversion_rate": 0.15,
  "avg_order_value": 45000,
  "top_products": ["prod_01", "prod_02"]
}
```

### Seasonal Categories

```json
{
  "seasonal": true,
  "season": "spring_summer_2024",
  "start_date": "2024-03-01",
  "end_date": "2024-08-31",
  "discount_eligible": true
}
```

## ✅ Testing

### Test Category API
```bash
# Test store endpoint
curl http://localhost:9000/store/product-categories?limit=5

# Test admin endpoint
curl http://localhost:9000/admin/product-categories/pcat_01HXX

# Test with products
curl "http://localhost:9000/store/product-categories?include_products=true"
```

### Test Frontend Methods
```javascript
// In browser console
const categories = await medusaService.getProductCategories();
console.log('Categories:', categories);

const category = await medusaService.getProductCategory(categories[0].id);
console.log('Category detail:', category);

const products = await medusaService.getProductsByCategory(categories[0].id);
console.log('Products in category:', products);
```

## 🎯 Best Practices

1. **Keep hierarchy shallow** - Maximum 3 levels deep
2. **Use descriptive names** - "Women's Outerwear" not "Cat1"
3. **Add metadata** - Use for filtering, sorting, analytics
4. **Optimize images** - Add category images for better UX
5. **Monitor performance** - Track popular categories
6. **SEO-friendly handles** - Use kebab-case, descriptive handles

## 📚 Related Documentation

- [Medusa Product Categories](https://docs.medusajs.com/references/product/models/ProductCategory)
- [Query API](https://docs.medusajs.com/learn/fundamentals/api-routes/queries)
- [Product Organization](https://docs.medusajs.com/commerce-modules/product)

## 🎉 Summary

Your FORMÉ HAUS platform now has complete product category support:

✅ **Custom API Routes** - Admin & Store endpoints  
✅ **Frontend Integration** - Service methods with caching  
✅ **Hierarchical Structure** - Parent/child relationships  
✅ **Performance Optimized** - 5-min caching, retry logic  
✅ **Production Ready** - Error handling, logging, type safety  

All implementations follow Medusa v2 best practices and are ready for production use!
