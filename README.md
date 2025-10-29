# Forme Haus - Modern E-commerce Platform

A modern, multilingual e-commerce platform built with Medusa.js v2 and vanilla JavaScript.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- npm

### Start Development

```bash
# Backend (Terminal 1)
cd medusa-storefront
npm run dev

# Frontend (Terminal 2)
cd ..
npx vite --port 5173
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:9000
- Admin Panel: http://localhost:9000/app

**Admin Credentials:**
- Email: `admin@formehaus.com`
- Password: `supersecret123`

## 🔑 Environment Setup

Create `.env` in `medusa-storefront/`:

```env
DATABASE_URL=postgres://medusa:medusa@localhost:5432/medusa
STORE_CORS=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,http://localhost:3000
ADMIN_CORS=http://localhost:7000,http://localhost:7001
AUTH_CORS=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,http://localhost:3000,http://localhost:7000,http://localhost:7001
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret

# Tolgee (i18n)
TOLGEE_PROJECT_ID=your_project_id
TOLGEE_API_URL=https://app.tolgee.io
TOLGEE_API_KEY=your_api_key
```

## 📦 Database Seeding

```bash
cd medusa-storefront

# Seed products & categories
npx medusa exec ./src/scripts/seed.ts

# Seed Saudi market data (SAR pricing)
npx medusa exec ./src/scripts/seed-saudi-market.ts
```

## 📂 Project Structure

```
├── medusa-storefront/          # Medusa.js v2 backend
│   ├── src/
│   │   ├── api/               # Custom API routes
│   │   │   ├── admin/        # Admin endpoints
│   │   │   └── store/        # Storefront endpoints
│   │   ├── workflows/         # Business workflows
│   │   ├── scripts/           # Database seeds
│   │   ├── jobs/              # Scheduled jobs
│   │   └── subscribers/       # Event handlers
│   ├── .env                   # Backend config
│   └── medusa-config.ts       # Medusa configuration
├── index.html                  # Homepage
├── collections.html            # Collections page
├── product.html                # Product detail page
├── checkout.html               # Checkout page
├── about.html                  # About page
├── script.js                   # Main frontend logic
├── medusa-service.js           # API integration
├── i18n.js                     # Translations (EN/AR)
├── checkout.js                 # Checkout logic
└── style.css                   # Global styles
```

## ✨ Features

- ✅ **Multilingual Support** - English & Arabic via Tolgee
- ✅ **Multi-Currency** - SAR & USD pricing
- ✅ **Product Management** - Categories, collections, variants
- ✅ **Shopping Cart** - Full cart functionality
- ✅ **Checkout Flow** - Complete order processing
- ✅ **Admin Dashboard** - Medusa admin UI
- ✅ **Custom Animations** - GSAP & Lenis smooth scrolling
- ✅ **Responsive Design** - Mobile-first approach

## 🛠️ Tech Stack

**Backend:**
- Medusa.js v2.11.0
- PostgreSQL 14+
- Node.js 20+
- Tolgee Plugin (i18n)

**Frontend:**
- Vanilla JavaScript (ES6+)
- Vite 4.5
- GSAP (animations)
- Lenis (smooth scrolling)

## 🐛 Troubleshooting

**Port 9000 already in use:**
```bash
netstat -ano | findstr :9000
taskkill /F /PID <PID>
```

**CORS errors:**
- Ensure ports match in `.env` `STORE_CORS`
- Restart backend after changing `.env`

**Products not loading:**
- Run seed scripts
- Check backend logs
- Verify database connection

## 📚 Documentation

- **[Complete Implementation Summary](COMPLETE_IMPLEMENTATION_SUMMARY.md)** - Detailed feature overview
- **[Project Backup](PROJECT_BACKUP_2025-10-27.md)** - Full configuration reference

## 📝 License

MIT
