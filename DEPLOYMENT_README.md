# FORMÉ HAUS - Full Stack E-commerce Application

## Overview

This is a complete full-stack e-commerce application built with:
- **Frontend**: HTML, CSS, JavaScript with Vite for development
- **Backend**: Medusa.js e-commerce platform (mocked for development)

## Current Status

✅ **Fully Functional Development Environment**
- Frontend development server running on port 5173
- Mock Medusa backend API running on port 9000
- CORS configured for cross-origin requests
- Environment variables set up for both frontend and backend

## How to Run the Application

### Quick Start (Recommended)

Double-click on `start-full-dev-server.bat` to automatically start both servers.

### Manual Start

1. **Start the Mock Medusa Backend**:
   ```bash
   node mock-medusa-server.js
   ```

2. **Start the Frontend Development Server** (in a separate terminal):
   ```bash
   npm run dev
   ```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:9000

## Features

### Frontend
- Responsive fashion e-commerce layout
- Video hero section with smooth animations
- Mega menu navigation
- Product and collection pages
- Shopping cart functionality
- Checkout flow
- EN/AR language toggle with RTL support
- Works best on modern browsers (Chrome, Firefox, Safari, Edge)

### Backend (Mock API)
- Product listing and details
- Collection listing and details
- Shopping cart management
- Order processing simulation

## API Endpoints

The mock backend supports the following endpoints:

### Products
- `GET /store/products` - List all products
- `GET /store/products/{id}` - Get specific product

### Collections
- `GET /store/collections` - List all collections
- `GET /store/collections/{id}` - Get specific collection

### Carts
- `POST /store/carts` - Create a new cart
- `GET /store/carts/{id}` - Get cart details
- `POST /store/carts/{id}/line-items` - Add items to cart

## File Structure

```
c:\Users\futte\Desktop\we are close\
├── index.html                 # Main frontend page
├── collections.html           # Collections page
├── product.html              # Product detail page
├── checkout.html             # Checkout page
├── about.html                # About page
├── admin.html                # Admin page
├── style.css                 # Global styles
├── script.js                 # Global JavaScript for home/collections
├── product-script.js         # Product page specific logic
├── checkout.js               # Checkout page logic
├── i18n.js                   # EN/AR language toggle and RTL support
├── medusa-service.js         # API client for Medusa
├── mock-medusa-server.js     # Mock Medusa backend server
├── package.json              # Frontend package configuration
├── .env.local                # Frontend environment variables
├── FULL_STACK_SETUP.md       # Detailed setup instructions
├── DEPLOYMENT_README.md      # This file
├── start-full-dev-server.bat # Start both servers
├── start-frontend-real.bat   # Frontend with real backend
├── start-medusa-real.bat     # Real Medusa backend
└── medusa-storefront\        # Real Medusa backend (in progress)
    ├── package.json          # Backend package configuration
    ├── .env                  # Backend environment variables
    └── ...                   # Other backend files
```

## Environment Variables

### Frontend (.env.local)
```
VITE_MEDUSA_BACKEND_URL=http://localhost:9000
VITE_MEDUSA_ADMIN_URL=http://localhost:7001
```

### Backend (medusa-storefront/.env)
```
DATABASE_URL=sqlite://./medusa-db.sql
STORE_CORS=http://localhost:5174,http://localhost:3000
ADMIN_CORS=http://localhost:7000,http://localhost:7001
AUTH_CORS=http://localhost:5174,http://localhost:3000,http://localhost:7000,http://localhost:7001
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
```

## Deployment Instructions

### Frontend Deployment

1. Build the production version:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist/` directory

3. Deploy the `dist/` folder to your preferred hosting platform (Netlify, Vercel, GitHub Pages, etc.)

### Backend Deployment

To deploy the real Medusa backend:

1. Complete the database setup:
   ```bash
   cd medusa-storefront
   npx medusa db:setup
   npx medusa db:migrate
   ```

2. Seed with sample data (optional):
   ```bash
   npm run seed
   ```

3. Build the backend:
   ```bash
   npm run build
   ```

4. Deploy to your preferred hosting platform following Medusa's deployment guides

## Troubleshooting

### Common Issues

1. **Port Conflicts**:
   ```bash
   # Check for processes using ports
   netstat -ano | findstr :9000
   netstat -ano | findstr :5173
   
   # Kill conflicting processes
   taskkill /F /PID [PID]
   ```

2. **Dependency Issues**:
   ```bash
   # Install/update dependencies
   npm install
   cd medusa-storefront && npm install
   ```

3. **Server Not Starting**:
   - Ensure you're in the correct directory
   - Check that Node.js is installed (version 20 or higher)
   - Verify all environment variables are set

### Getting Help

- Check the detailed setup guide: `FULL_STACK_SETUP.md`
- Refer to Medusa documentation: https://docs.medusajs.com
- Contact support if issues persist

## Next Steps

1. ✅ **Development Environment**: Currently functional
2. ⬜ **Real Medusa Backend**: Complete database setup and migration
3. ⬜ **Production Deployment**: Deploy both frontend and backend
4. ⬜ **Customization**: Add your own products, collections, and branding
5. ⬜ **Advanced Features**: Implement payment processing, user accounts, etc.

## Support

For issues with this setup, please refer to the documentation or contact the development team.