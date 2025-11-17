# Vercel Deployment Guide

This guide will help you deploy the Forme Haus storefront to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier available)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Medusa Backend**: A deployed Medusa.js backend (see Backend Deployment below)

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

2. **Configure Project**
   - Framework Preset: Vercel will auto-detect **Vite**
   - Root Directory: Leave as `./` (project root)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install` (auto-detected)

3. **Add Environment Variables**
   Click on "Environment Variables" and add:
   ```
   VITE_MEDUSA_BACKEND_URL = https://your-medusa-backend.com
   VITE_MEDUSA_ADMIN_URL = https://your-medusa-admin.com
   ```
   
   **Important**: Replace the URLs with your actual Medusa backend URLs.

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)
   - Your site will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts to configure your project.

4. **Add Environment Variables**
   ```bash
   vercel env add VITE_MEDUSA_BACKEND_URL
   vercel env add VITE_MEDUSA_ADMIN_URL
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Backend Deployment

The Medusa.js backend needs to be deployed separately. Here are some options:

### Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Create a new project from your `medusa-storefront` directory
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy

### Render
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Configure build and start commands
5. Add PostgreSQL database
6. Deploy

### Heroku
1. Create a new Heroku app
2. Add Heroku Postgres add-on
3. Configure buildpacks
4. Deploy via Git

## Post-Deployment Configuration

### Update CORS Settings

After deploying, update your Medusa backend CORS configuration to include your Vercel domain:

In `medusa-storefront/.env`:
```env
STORE_CORS=https://your-project-name.vercel.app
AUTH_CORS=https://your-project-name.vercel.app
ADMIN_CORS=https://your-admin-domain.vercel.app
```

### Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS

## Troubleshooting

### Build Fails

**Issue**: Build fails with module not found errors
**Solution**: 
- Ensure all dependencies are in `package.json`
- Check that `vite.config.js` is properly configured
- Review build logs in Vercel dashboard

### CORS Errors

**Issue**: Frontend can't connect to backend
**Solution**:
- Verify environment variables are set in Vercel
- Check CORS settings in Medusa backend include your Vercel domain
- Ensure backend is running and accessible

### Products Not Loading

**Issue**: No products appear on the site
**Solution**:
- Verify `VITE_MEDUSA_BACKEND_URL` points to your running backend
- Check that backend database is seeded with products
- Verify backend API is accessible (test with curl or Postman)

### Environment Variables Not Working

**Issue**: Environment variables are undefined
**Solution**:
- Ensure variables are prefixed with `VITE_`
- Redeploy after adding environment variables
- Check spelling and case sensitivity

## Monitoring and Analytics

### Vercel Analytics (Optional)

1. Go to your project in Vercel dashboard
2. Navigate to "Analytics" tab
3. Enable Vercel Analytics
4. Add analytics snippet if needed

### Performance Monitoring

Vercel provides built-in performance monitoring:
- Real-time deployment logs
- Build performance metrics
- Runtime error tracking

## Continuous Deployment

Vercel automatically deploys when you push to your repository:

- **Production**: Pushes to `main` branch deploy to production
- **Preview**: Pushes to other branches create preview deployments
- **Pull Requests**: Each PR gets its own preview URL

## Rollback

If something goes wrong:

1. Go to Vercel dashboard
2. Navigate to "Deployments"
3. Find a previous working deployment
4. Click "Promote to Production"

## Best Practices

1. **Environment Variables**: Never commit `.env` files with secrets
2. **Testing**: Test preview deployments before promoting to production
3. **Caching**: Vercel automatically caches static assets
4. **CDN**: Your site is served via Vercel's global CDN
5. **HTTPS**: All deployments use HTTPS by default

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Medusa Documentation](https://docs.medusajs.com/)

## Next Steps

After deployment:

1. ✅ Test all pages work correctly
2. ✅ Verify product loading and cart functionality
3. ✅ Test checkout flow end-to-end
4. ✅ Configure custom domain (optional)
5. ✅ Set up monitoring and analytics
6. ✅ Share your live site!

---

**Need Help?** Check the [main README](README.md) for more information about the project structure and features.
