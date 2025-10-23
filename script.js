import { animate, inView } from 'https://esm.run/framer-motion';
import medusaService from './medusa-service.js';
import { applySplitText } from './split-text.js';
import { initScrollVelocity } from './scroll-velocity.js';
import { initLightRays } from './light-rays.js';
import { initMagicBento } from './magic-bento.js';
import { applyI18n, getLang, setLang } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    // Initialize header behavior
    const header = document.getElementById('main-header');
    const scrollThreshold = 50; 

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // Initialize language and cart UI
    setLang(getLang());
    applyI18n(document);
    initCartUI();

    // Load products for featured sections or collections page
    loadFeaturedProducts();
    renderCollectionsProducts();

    // SplitText effect on marked headings
    runSplitText();
    initScrollVelocity('[data-scroll-velocity]');
    initLightRays('[data-light-rays]');
    initMagicBento('[data-magic-bento]');

    // Language toggle
    const langEn = document.getElementById('lang-en');
    const langAr = document.getElementById('lang-ar');
    if (langEn) langEn.addEventListener('click', () => switchLang('en'));
    if (langAr) langAr.addEventListener('click', () => switchLang('ar'));

    // Animation for scroll elements
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

    elementsToAnimate.forEach(element => {
        const delay = parseFloat(element.style.getPropertyValue('--animation-delay')) || 0;
        
        inView(element, () => {
            animate(
                element,
                { 
                    opacity: 1, 
                    y: 0 
                },
                { 
                    duration: 0.8, 
                    delay: delay / 1000,
                    ease: [0.22, 1, 0.36, 1] // Quintic Out
                }
            );
            return () => { // Optional: animation on exit view
                 animate(
                    element,
                    { opacity: 0, y: 30 },
                    { duration: 0.4 }
                );
            };
        }, { margin: "-10% 0px -10% 0px" });
    });
});

async function loadFeaturedProducts() {
    try {
        const products = await medusaService.getAllProducts();
        
        // Find the featured products container
        const featuredContainer = document.querySelector('.grid.md\\:grid-cols-2');
        if (featuredContainer && products.length >= 2) {
            // Update the first two featured products
            const featuredItems = featuredContainer.querySelectorAll('.animate-on-scroll');
            featuredItems.forEach((item, index) => {
                if (products[index]) {
                    const product = products[index];
                    const img = item.querySelector('img');
                    const title = item.querySelector('h3');
                    const link = item.querySelector('a');
                    
                    if (img) img.src = product.images?.[0]?.url || '';
                    if (title) title.textContent = product.title;
                    if (link) link.href = `/product.html?handle=${product.handle}`;
                }
            });
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

function animateSplitChars() {
    const chars = document.querySelectorAll('.split-char');
    chars.forEach((ch, i) => {
        animate(
            ch,
            { opacity: [0, 1], y: [8, 0] },
            { duration: 0.5, delay: 0.02 * i, easing: 'ease-out' }
        );
    });
}

function initCartUI() {
    // Update count from localStorage
    const countEl = document.getElementById('cart-count');
    const drawer = document.getElementById('cart-drawer');
    const openBtn = document.getElementById('cart-button');
    const closeBtn = document.getElementById('cart-close');
    const listEl = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('cart-checkout');

    const sync = () => {
        const lines = JSON.parse(localStorage.getItem('medusa_cart_lines') || '[]');
        const count = lines.reduce((a, l) => a + (l.quantity || 0), 0);
        if (countEl) countEl.textContent = String(count);
        if (listEl) {
            listEl.innerHTML = lines.length ? lines.map(l => `
                <div class="flex gap-3 py-3 border-b border-white/10 items-center" data-line-id="${l.id}">
                  <img src="${l.image || ''}" alt="${l.title || ''}" class="w-12 h-12 object-cover bg-gray-100" />
                  <div class="flex-1">
                    <div class="text-sm">${l.title || ''}</div>
                    <div class="text-xs opacity-70">${l.variant || ''}</div>
                    <div class="mt-2 inline-flex items-center gap-2">
                      <button class="px-2 py-1 border" data-action="dec">-</button>
                      <span class="min-w-[1.5rem] text-center">${l.quantity || 1}</span>
                      <button class="px-2 py-1 border" data-action="inc">+</button>
                      <button class="ml-3 text-red-600" data-action="remove">Remove</button>
                    </div>
                  </div>
                  <div class="text-sm whitespace-nowrap">${l.quantity || 1} × ${l.price || ''} ${l.currency || ''}</div>
                </div>
            `).join('') : '<div class="py-8 text-center opacity-70">Your cart is empty.</div>';
        }
        if (checkoutBtn) {
            checkoutBtn.href = 'checkout.html';
            checkoutBtn.classList.remove('pointer-events-none', 'opacity-50');
        }
    };

    sync();
    window.addEventListener('cart:updated', sync);

    if (openBtn && drawer) openBtn.addEventListener('click', () => drawer.classList.remove('translate-x-full'));
    if (closeBtn && drawer) closeBtn.addEventListener('click', () => drawer.classList.add('translate-x-full'));

    // Quantity and remove handlers
    if (listEl) {
        listEl.addEventListener('click', async (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const action = btn.dataset.action;
            if (!action) return;
            const row = btn.closest('[data-line-id]');
            const lineId = row?.dataset.lineId;
            let cartId = localStorage.getItem('medusa_cart_id');
            if (!lineId || !cartId) return;
            try {
                let cart;
                const lines = JSON.parse(localStorage.getItem('medusa_cart_lines') || '[]');
                const current = lines.find(x => x.id === lineId);
                let qty = Math.max(1, (current?.quantity || 1));
                if (action === 'inc') qty += 1;
                if (action === 'dec') qty = Math.max(1, qty - 1);
                if (action === 'remove') {
                    cart = await medusaService.removeLineItem(cartId, lineId);
                } else {
                    cart = await medusaService.updateLineItem(cartId, lineId, qty);
                }
                if (cart) {
                    const items = (cart.items || []).map(it => ({
                        id: it.id,
                        quantity: it.quantity,
                        title: it.title,
                        variant: it.variant?.title,
                        price: ((it?.unit_price || 0) / 100).toFixed(2),
                        currency: (it?.currency_code || '').toUpperCase(),
                        image: it.thumbnail || (it?.variant?.product?.images?.[0]?.url || '')
                    }));
                    localStorage.setItem('medusa_cart_lines', JSON.stringify(items));
                    sync();
                    window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count: items.reduce((a, l) => a + (l.quantity || 0), 0) } }));
                }
            } catch (err) {
                console.error('Cart update failed', err);
            }
        });
    }
}

// Show Medusa Admin link if configured
const adminLink = document.getElementById('admin-link');
try {
    const adminUrl = import.meta?.env?.VITE_MEDUSA_ADMIN_URL;
    if (adminLink) {
        if (adminUrl) {
            adminLink.href = adminUrl;
            adminLink.classList.remove('hidden');
        }
    }
} catch {}

async function renderCollectionsProducts() {
    const grid = document.getElementById('shop-products-grid');
    if (!grid) return;
    try {
        // Check URL param for collection
        const params = new URLSearchParams(window.location.search);
        const handle = params.get('collection');
        let products = [];
        if (handle) {
          const col = await medusaService.getCollectionByHandle(handle);
          if (col?.id) {
            products = await medusaService.getProductsByCollection(col.id);
          } else {
            products = await medusaService.getAllProducts();
          }
        } else {
          products = await medusaService.getAllProducts();
        }
        const priceFmt = (p) => {
          const amounts = (p.variants || []).flatMap(v => (v.prices || []).map(pr => ({ amount: pr.amount, currency: pr.currency_code })));
          if (!amounts.length) return '';
          const lowest = amounts.reduce((m, a) => a.amount < m.amount ? a : m, amounts[0]);
          return `$${(lowest.amount / 100).toFixed(2)} ${lowest.currency?.toUpperCase() || ''}`;
        };
        grid.innerHTML = products.map(p => `
          <a href="/product.html?handle=${p.handle}" class="group block">
            <div class="aspect-[4/5] overflow-hidden bg-gray-100">
              <img src="${p.images?.[0]?.url || ''}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div class="mt-3 flex items-baseline justify-between">
              <h3 class="text-sm">${p.title}</h3>
              <span class="text-soft-gold text-sm">${priceFmt(p)}</span>
            </div>
          </a>
        `).join('');

        // Render collections filter if container exists
        const bar = document.getElementById('collections-bar');
        if (bar) {
          const cols = await medusaService.getCollections();
          bar.innerHTML = cols.map(c => `
             <a class="px-3 py-1 border border-white/20 hover:border-soft-gold transition" href="/collections.html?collection=${c.handle}">${c.title}</a>
          `).join('');
        }
    } catch (e) {
        console.error('Error rendering collections products', e);
        grid.innerHTML = '<div class="col-span-full text-center">Failed to load products.</div>';
    }
}

function runSplitText() {
    applySplitText('[data-split-text]');
    animateSplitChars();
}

function switchLang(lang) {
    setLang(lang);
    applyI18n(document);
    runSplitText();
}
