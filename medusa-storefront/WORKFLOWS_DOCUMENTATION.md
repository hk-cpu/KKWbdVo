# FORMÉ HAUS - Medusa Workflows & Automation

This document describes the custom workflows, API routes, scheduled jobs, and subscribers implemented for the FORMÉ HAUS e-commerce platform following Medusa v2 best practices.

## Overview

All automation is built using Medusa's **Workflow** system, which provides:
- ✅ Data consistency across operations
- ✅ Automatic rollback on failures
- ✅ Reliable error handling
- ✅ Composable steps

## 📁 File Structure

```
medusa-storefront/src/
├── workflows/
│   └── update-saudi-pricing.ts        # Workflow for SAR pricing sync
├── api/
│   └── admin/
│       └── update-saudi-pricing/
│           └── route.ts                # Admin API route
├── jobs/
│   └── sync-saudi-pricing.ts          # Daily scheduled job
└── subscribers/
    └── product-created.ts              # Auto-pricing on new products
```

## 🔄 Workflows

### 1. Update Saudi Pricing Workflow

**File**: `src/workflows/update-saudi-pricing.ts`

**Purpose**: Bulk update all products with SAR (Saudi Riyal) pricing based on USD prices.

**Features**:
- Calculates SAR prices using configurable conversion rate (default: 3.75)
- Skips products that already have SAR pricing
- Provides detailed logging
- Automatic rollback if any step fails

**Usage in Code**:
```typescript
const { result } = await updateSaudiPricingWorkflow(container)
  .run({
    input: {
      productIds: ['prod_123', 'prod_456'], // Optional: specific products
      sarRate: 3.75, // Optional: custom conversion rate
    }
  })

console.log(`Updated ${result.count} variants`)
```

## 🌐 API Routes

### POST /admin/update-saudi-pricing

**File**: `src/api/admin/update-saudi-pricing/route.ts`

**Purpose**: Admin endpoint to manually trigger SAR pricing updates.

**Request Body**:
```json
{
  "productIds": ["prod_123"], // Optional: specific products
  "sarRate": 3.75             // Optional: conversion rate
}
```

**Response**:
```json
{
  "success": true,
  "message": "Updated 15 product variants with SAR pricing",
  "data": {
    "count": 15,
    "updatedProducts": [...]
  }
}
```

**Example Usage**:
```bash
# Update all products
curl -X POST http://localhost:9000/admin/update-saudi-pricing \
  -H "Content-Type: application/json" \
  -d '{}'

# Update specific products with custom rate
curl -X POST http://localhost:9000/admin/update-saudi-pricing \
  -H "Content-Type: application/json" \
  -d '{"productIds": ["prod_123"], "sarRate": 3.8}'
```

## ⏰ Scheduled Jobs

### Sync Saudi Pricing Daily

**File**: `src/jobs/sync-saudi-pricing.ts`

**Purpose**: Automatically sync SAR pricing for all products every day.

**Schedule**: Daily at 2:00 AM (Saudi Arabia time)
- Cron expression: `0 2 * * *`

**What it does**:
1. Runs the update-saudi-pricing workflow
2. Adds SAR prices to any products missing them
3. Uses standard conversion rate (3.75)
4. Logs results for monitoring

**Manual Execution** (for testing):
```bash
# From medusa-storefront directory
npx medusa exec ./src/jobs/sync-saudi-pricing.ts
```

## 📡 Event Subscribers

### Product Created Subscriber

**File**: `src/subscribers/product-created.ts`

**Purpose**: Automatically add SAR pricing when new products are created.

**Event**: `product.created`

**Behavior**:
1. Triggered when any product is created
2. Checks if product has variants with USD prices
3. Calculates SAR price using 3.75 rate
4. Adds SAR pricing to all variants
5. Logs completion status

**Benefits**:
- ✅ New products immediately have Saudi market pricing
- ✅ No manual intervention required
- ✅ Consistent pricing across all products

## 🎯 Use Cases

### Use Case 1: Initial Setup
**Scenario**: You have existing products without SAR pricing.

**Solution**:
```bash
# Run the API endpoint to update all products
curl -X POST http://localhost:9000/admin/update-saudi-pricing
```

### Use Case 2: Daily Maintenance
**Scenario**: Ensure all products have SAR pricing.

**Solution**: The scheduled job runs automatically every day at 2 AM.

### Use Case 3: New Product Addition
**Scenario**: Admin creates a new product via dashboard.

**Solution**: The subscriber automatically adds SAR pricing based on USD price.

### Use Case 4: Custom Conversion Rate
**Scenario**: Saudi Riyal exchange rate changes.

**Solution**:
```bash
# Update with new rate
curl -X POST http://localhost:9000/admin/update-saudi-pricing \
  -H "Content-Type: application/json" \
  -d '{"sarRate": 3.8}'
```

## 🔧 Configuration

### Conversion Rate

Default: **3.75 SAR per USD**

To change:
1. **API Route**: Pass `sarRate` in request body
2. **Scheduled Job**: Edit `sarRate` value in `sync-saudi-pricing.ts`
3. **Subscriber**: Edit `sarRate` constant in `product-created.ts`

### Schedule

To change the scheduled job timing, edit the cron expression in `src/jobs/sync-saudi-pricing.ts`:

```typescript
export const config = {
  name: "sync-saudi-pricing-daily",
  schedule: `0 2 * * *`, // Minute Hour Day Month DayOfWeek
}
```

**Examples**:
- Every hour: `0 * * * *`
- Twice daily (2 AM & 2 PM): `0 2,14 * * *`
- Weekly on Monday at 3 AM: `0 3 * * 1`

## 📊 Monitoring & Logs

All workflows, jobs, and subscribers include comprehensive logging:

```
[Scheduled Job] Starting daily Saudi pricing sync...
[Subscriber] New product created: prod_01HXXX
[Subscriber] Added SAR pricing (262.13 SAR) to variant var_01HXXX
[Scheduled Job] Successfully updated 5 product variants
```

To view logs:
```bash
# In medusa-storefront directory
npm run dev

# Logs appear in the console
```

## 🚀 Testing

### Test the Workflow
```bash
# Create a test script in src/scripts/
npx medusa exec ./src/scripts/test-pricing-workflow.ts
```

### Test the API Route
```bash
# Use curl or Postman
curl -X POST http://localhost:9000/admin/update-saudi-pricing
```

### Test the Subscriber
```bash
# Create a product via Admin dashboard
# Watch the logs for subscriber activity
```

## 🔐 Security

- **Admin Routes**: Protected by admin authentication
- **Scheduled Jobs**: Run server-side only
- **Subscribers**: Internal event-driven, no external access
- **Workflows**: Isolated with automatic rollback

## 📚 Medusa Documentation References

- [Workflows](https://docs.medusajs.com/learn/fundamentals/workflows)
- [Scheduled Jobs](https://docs.medusajs.com/learn/fundamentals/scheduled-jobs)
- [Subscribers](https://docs.medusajs.com/learn/fundamentals/events-and-subscribers)
- [Product Module](https://docs.medusajs.com/commerce-modules/product)
- [API Routes](https://docs.medusajs.com/learn/fundamentals/api-routes)

## 🎉 Summary

Your FORMÉ HAUS platform now has:

✅ **Automated SAR Pricing** - All products automatically get Saudi market prices
✅ **Daily Sync** - Scheduled job ensures consistency
✅ **Event-Driven** - New products automatically priced
✅ **Admin Control** - Manual API endpoint for on-demand updates
✅ **Rollback Safety** - Automatic undo on failures
✅ **Production-Ready** - Following Medusa v2 best practices

All implementations follow official Medusa documentation and use the recommended Workflow pattern for data consistency and reliability.
