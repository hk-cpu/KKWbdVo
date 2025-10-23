# FORMÉ HAUS Website

Welcome to the FORMÉ HAUS website repository. This is a static HTML/CSS/JavaScript website for the fictional fashion brand FORMÉ HAUS.

## Previewing the Website

### Method 1: Direct Browser Opening (No Installation Required)
1. Navigate to the project folder
2. Double-click on `index.html` to open it in your default browser

Note: Some features might not work perfectly when opened this way due to browser security restrictions.

### Method 2: Using a Local Development Server (Recommended)
To get the full functionality and enable hot reloading, you can run a local development server.

#### Option A: Using Node.js (Recommended)
1. Install Node.js from https://nodejs.org/
2. After installation, double-click on `start-dev-server.bat` or run in terminal:
   ```bash
   node server.js
   ```
3. Open your browser and go to http://localhost:3000

#### Option B: Using Python (If Available)
If you have Python installed, navigate to the project folder and run:
```bash
python -m http.server 8000
```
Then open your browser and go to http://localhost:8000

#### Option C: Using npm (If Node.js is installed)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and go to the URL shown in the terminal (typically http://localhost:5173)

## Environment
- Copy `.env.example` to `.env.local` and set the Medusa backend URL:
  ```env
  VITE_MEDUSA_BACKEND_URL=http://localhost:9000
  VITE_MEDUSA_ADMIN_URL=http://localhost:7001
  ```
- Do not commit real secrets. `.gitignore` excludes `.env*`.

## Production Build & Preview
- Build: `npm run build` (outputs to `dist/`)
- Preview: `npm run preview` (serves `dist/` locally)

## Project Structure
- `index.html` - Home page
- `collections.html` - Collections page
- `about.html` - About page
- `style.css` - Custom styles
- `script.js` - JavaScript functionality (home/collections)
- `product.html` / `product-script.js` - Product detail view
- `medusa-service.js` - Medusa Store API access (reads Vite env)
- `checkout.html` / `checkout.js` - Creates payment sessions and completes cart
- `i18n.js` - Simple EN/AR dictionary and helpers
- `package.json` - Project configuration and dependencies
- `server.js` - Simple Node.js server for local development
- `start-dev-server.bat` - Windows batch file to start the development server

## Features
- Responsive design
- Smooth animations
- Mega menu navigation
- Video background hero section
- Modern fashion brand layout
- Medusa integration: collections grid, product details, add-to-cart, mini-cart drawer
- Checkout: creates payment sessions and attempts cart completion
- i18n: EN/AR toggle with basic RTL support

## Medusa setup tips
- Enable CORS for your frontend origin in the Medusa backend config.
- Configure payment providers (Manual, Stripe, Hyperpay, PayTabs, STC Pay, Tamara) in your Medusa instance; this frontend lists sessions and follows redirect URLs when provided.
- Saudi gateways: Hyperpay and PayTabs both support KSA; use corresponding Medusa plugins and set credentials in the backend. Ensure callback URLs match your environment.

## Browser Support
The website works best on modern browsers (Chrome, Firefox, Safari, Edge).

## License
This is a demo project for educational purposes.
