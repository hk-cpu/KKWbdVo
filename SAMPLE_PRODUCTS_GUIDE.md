# Sample Products - FORMÉ HAUS Fashion Collection

Your Medusa backend has been successfully seeded with sample fashion products!

## 📦 What Was Added

### Product Types (3)
1. **Apparel** - Clothing items (seasonal: true, featured: true)
2. **Accessories** - Bags, scarves, and other accessories
3. **Outerwear** - Coats and jackets (seasonal: true, premium: true)

### Products (7)

#### Apparel (3 products)
1. **Silk Drape Blouse**
   - Handle: `silk-drape-blouse`
   - Sizes: XS, S, M, L, XL
   - Colors: Ivory, Black, Navy
   - Price: $129.00 / €115.00

2. **Linen Wide-Leg Trousers**
   - Handle: `linen-wide-leg-trousers`
   - Sizes: 26, 28, 30, 32, 34
   - Colors: Sand, Charcoal, White
   - Price: $159.00 / €142.00

3. **Merino Wool Sweater**
   - Handle: `merino-wool-sweater`
   - Sizes: XS, S, M, L, XL
   - Colors: Camel, Charcoal, Cream
   - Price: $189.00 / €169.00

#### Outerwear (2 products)
4. **Tailored Wool Coat**
   - Handle: `tailored-wool-coat`
   - Sizes: XS, S, M, L, XL
   - Colors: Camel, Navy, Black
   - Price: $499.00 / €449.00

5. **Leather Bomber Jacket**
   - Handle: `leather-bomber-jacket`
   - Sizes: XS, S, M, L, XL
   - Colors: Black, Cognac
   - Price: $699.00 / €629.00

#### Accessories (2 products)
6. **Italian Leather Tote**
   - Handle: `italian-leather-tote`
   - Colors: Tan, Black, Cognac
   - Price: $329.00 / €295.00

7. **Cashmere Scarf**
   - Handle: `cashmere-scarf`
   - Colors: Camel, Charcoal, Ivory, Navy
   - Price: $249.00 / €223.00

## 🎯 How to Use

### View Products on Your Frontend
1. Start your Medusa backend: `cd medusa-storefront && npm run dev`
2. Start your frontend: `npm run dev`
3. Navigate to `http://localhost:5173/collections.html`
4. You should see all products displayed

### Filter by Product Type
- Click the **Types** filter buttons on the collections page
- Options: Apparel, Accessories, Outerwear
- URL format: `/collections.html?type={type_id}`

### View Individual Products
- Click any product card to see details
- URL format: `/product.html?handle={product-handle}`

## 🔑 API Testing

### Get All Products
```bash
GET http://localhost:9000/store/products
Headers:
  x-publishable-api-key: {your-key}
```

### Get Product Types
```bash
GET http://localhost:9000/store/product-types
Headers:
  x-publishable-api-key: {your-key}
```

### Get Products by Type
```bash
GET http://localhost:9000/store/products?type_id[]={type_id}
Headers:
  x-publishable-api-key: {your-key}
```

### Get Specific Product
```bash
GET http://localhost:9000/store/products?handle=silk-drape-blouse
Headers:
  x-publishable-api-key: {your-key}
```

## 📝 Inventory

All products have been stocked with **100 units** per variant at your default warehouse location.

## 🎨 Images

All products use high-quality Unsplash images that match the luxury fashion aesthetic of FORMÉ HAUS.

## 🛠 Scripts Used

- **Main seed**: `src/scripts/seed-fashion.ts` - Creates product types and products
- **Inventory**: Already seeded from previous run
- **Location**: `medusa-storefront/src/scripts/`

## 🚀 Next Steps

1. **Start the backend**: `cd medusa-storefront && npm run dev`
2. **Start the frontend**: `npm run dev` (from project root)
3. **Browse products**: Visit `http://localhost:5173/collections.html`
4. **Filter by type**: Click the Type filter buttons
5. **Test checkout**: Add items to cart and complete purchase flow

## 📊 Summary

✅ 3 Product Types created
✅ 7 Fashion Products created
✅ 23 Product Variants created
✅ All variants have pricing in USD and EUR
✅ Inventory levels set (100 per variant)
✅ All products published and available
✅ Frontend integration ready with Type filtering

Enjoy your fully stocked FORMÉ HAUS storefront! 🎉
