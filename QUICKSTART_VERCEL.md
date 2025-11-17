# Quick Start - Vercel Deployment

This document provides a quick reference for deploying the Forme Haus storefront to Vercel.

## ⚡ One-Click Deploy

1. **Fork this repository** on GitHub
2. **Go to** [vercel.com/new](https://vercel.com/new)
3. **Import** your forked repository
4. **Add Environment Variables:**
   - `VITE_MEDUSA_BACKEND_URL` → Your Medusa backend URL
   - `VITE_MEDUSA_ADMIN_URL` → Your Medusa admin URL
5. **Click Deploy** 🚀

That's it! Your site will be live in ~2 minutes.

## 📋 Checklist Before Deployment

- [ ] Medusa backend is deployed and accessible
- [ ] Backend database is seeded with products
- [ ] Backend CORS is configured to allow your domain
- [ ] You have your backend URLs ready

## 🔧 Environment Variables

Set these in Vercel dashboard under Project Settings → Environment Variables:

```bash
VITE_MEDUSA_BACKEND_URL=https://your-backend.railway.app
VITE_MEDUSA_ADMIN_URL=https://your-admin.railway.app
```

## 📱 Testing Your Deployment

After deployment, test these pages:

- ✅ Homepage: `https://your-app.vercel.app/`
- ✅ Collections: `https://your-app.vercel.app/collections.html`
- ✅ Product: `https://your-app.vercel.app/product.html`
- ✅ Checkout: `https://your-app.vercel.app/checkout.html`
- ✅ About: `https://your-app.vercel.app/about.html`

## 🔄 Update CORS in Backend

After getting your Vercel URL, update your backend `.env`:

```env
STORE_CORS=https://your-app.vercel.app
AUTH_CORS=https://your-app.vercel.app
```

Then restart your backend.

## 💡 Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Add Vercel URL to backend CORS |
| Products not loading | Check backend URL in env vars |
| Build fails | Check build logs in Vercel |
| 404 on pages | Verify all HTML files built correctly |

## 📖 More Information

- **Full Guide**: See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- **README**: See [README.md](README.md)

## 🆘 Need Help?

- Check [Vercel Documentation](https://vercel.com/docs)
- Check [Medusa Documentation](https://docs.medusajs.com/)
- Review deployment logs in Vercel dashboard
