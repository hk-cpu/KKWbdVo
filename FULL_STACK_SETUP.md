# Full Stack Medusa E-commerce Setup

## Current Setup

We have successfully set up a functional full-stack environment with:

1. **Frontend**: Vite-based development server running on port 5173
2. **Backend**: Mock Medusa API server running on port 9000

## How to Run the Full Stack Application

### Option 1: Using Batch Scripts (Recommended)

We've created batch scripts to make it easy to start both servers:

1. **Start Full Development Environment**:
   ```
   start-full-dev-server.bat
   ```

2. **Start Frontend with Real Backend** (when you have the real Medusa backend working):
   ```
   start-frontend-real.bat
   ```

3. **Start Real Medusa Backend** (when you have it working):
   ```
   start-medusa-real.bat
   ```

### Option 2: Manual Start

1. **Start the Mock Medusa Backend**:
   ```bash
   node mock-medusa-server.js
   ```

2. **Start the Frontend Development Server** (in a separate terminal):
   ```bash
   npm run dev
   ```

## Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:9000

## Features Available

The mock backend supports the following endpoints:

1. **Products**:
   - `GET /store/products` - List all products
   - `GET /store/products/{id}` - Get specific product

2. **Collections**:
   - `GET /store/collections` - List all collections
   - `GET /store/collections/{id}` - Get specific collection

3. **Carts**:
   - `POST /store/carts` - Create a new cart
   - `GET /store/carts/{id}` - Get cart details
   - `POST /store/carts/{id}/line-items` - Add items to cart

## Next Steps for Real Medusa Backend

To transition from the mock backend to the real Medusa backend:

1. **Database Setup**:
   - Run `npx medusa db:setup` in the medusa-storefront directory
   - This will create the SQLite database

2. **Run Migrations**:
   - Run `npx medusa db:migrate` to apply database migrations

3. **Seed Data** (optional):
   - Run `npm run seed` to populate with sample data

4. **Start Real Backend**:
   - Run `npx medusa develop` to start the development server

## Troubleshooting

### Port Conflicts
If you encounter port conflicts:
```bash
# Check for processes using port 9000
netstat -ano | findstr :9000

# Kill the process (replace PID with actual process ID)
taskkill /F /PID [PID]
```

### Dependency Issues
If you encounter dependency issues:
```bash
# In the root directory
npm install

# In the medusa-storefront directory
npm install
```

## File Structure

```
c:\Users\futte\Desktop\we are close\
├── mock-medusa-server.js          # Mock Medusa backend server
├── index.html                     # Main frontend page
├── package.json                   # Frontend package configuration
├── .env.local                     # Frontend environment variables
├── medusa-storefront\             # Real Medusa backend (in progress)
│   ├── package.json               # Backend package configuration
│   ├── .env                       # Backend environment variables
│   └── ...                        # Other backend files
└── start-full-dev-server.bat      # Batch script to start both servers
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

## Deployment

For deployment, you would:

1. Build the frontend:
   ```bash
   npm run build
   ```

2. For the backend, follow Medusa deployment guides for your target platform (Vercel, Heroku, AWS, etc.)

3. Ensure environment variables are properly configured for production