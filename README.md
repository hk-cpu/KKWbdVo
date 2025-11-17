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

## 🚀 Vercel Deployment

### Prerequisites
- Vercel account (free tier works)
- Deployed Medusa backend (or use the local backend URL for testing)

### Deploy to Vercel

1. **Install Vercel CLI (optional):**
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel CLI:**
   ```bash
   vercel
   ```

3. **Or Deploy via Vercel Dashboard:**
   - Import your GitHub repository in Vercel
   - Vercel will auto-detect the Vite framework
   - Configure environment variables in Vercel dashboard

4. **Configure Environment Variables in Vercel:**
   Go to your project settings in Vercel and add:
   ```
   VITE_MEDUSA_BACKEND_URL=https://your-medusa-backend.com
   VITE_MEDUSA_ADMIN_URL=https://your-medusa-admin.com
   ```

5. **Build Settings (auto-detected):**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Important Notes
- The frontend is a static site and can be deployed to Vercel
- The Medusa backend should be deployed separately (e.g., Railway, Render, or your own server)
- Make sure to update CORS settings in your Medusa backend to include your Vercel domain
- Environment variables must be prefixed with `VITE_` to be exposed to the frontend

## 🐛 Troubleshooting

**Port 9000 already in use:**
```bash
netstat -ano | findstr :9000
taskkill /F /PID <PID>
```

**CORS errors:**
- Ensure ports match in `.env` `STORE_CORS`
- Restart backend after changing `.env`
- Add your Vercel domain to CORS settings in Medusa backend

**Products not loading:**
- Run seed scripts
- Check backend logs
- Verify database connection
- Verify environment variables in Vercel

## 📚 Documentation

- **[Complete Implementation Summary](COMPLETE_IMPLEMENTATION_SUMMARY.md)** - Detailed feature overview
- **[Project Backup](PROJECT_BACKUP_2025-10-27.md)** - Full configuration reference

## 📝 License

MIT
