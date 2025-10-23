import medusaService from './medusa-service.js';
import { applyI18n, getLang, setLang } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  try { lucide.createIcons(); } catch {}
  setLang(getLang());
  applyI18n(document);
  initAdminLink();
  renderCart();
  const btn = document.getElementById('start-payment');
  if (btn) btn.addEventListener('click', startPayment);
  const en = document.getElementById('lang-en');
  const ar = document.getElementById('lang-ar');
  if (en) en.addEventListener('click', () => { setLang('en'); applyI18n(document); });
  if (ar) ar.addEventListener('click', () => { setLang('ar'); applyI18n(document); });
});

function initAdminLink() {
  const adminLink = document.getElementById('admin-link');
  try {
    const url = import.meta?.env?.VITE_MEDUSA_ADMIN_URL;
    if (adminLink && url) { adminLink.href = url; adminLink.classList.remove('hidden'); }
  } catch {}
}

function renderCart() {
  const itemsEl = document.getElementById('checkout-items');
  const totalEl = document.getElementById('checkout-total');
  const items = JSON.parse(localStorage.getItem('medusa_cart_lines') || '[]');
  itemsEl.innerHTML = items.length ? items.map(l => `
    <div class="flex gap-3 py-3 border-b border-white/10">
      <img src="${l.image || ''}" alt="${l.title || ''}" class="w-16 h-16 object-cover bg-gray-100" />
      <div class="flex-1">
        <div class="text-sm">${l.title || ''}</div>
        <div class="text-xs opacity-70">${l.variant || ''}</div>
      </div>
      <div class="text-sm">${l.quantity || 1} × $${l.price || '0.00'} ${l.currency || ''}</div>
    </div>
  `).join('') : '<div class="py-8 text-center opacity-70">Your cart is empty.</div>';
  const total = items.reduce((a,l)=> a + (parseFloat(l.price||0)* (l.quantity||1)), 0);
  totalEl.textContent = `$${total.toFixed(2)}`;
}

async function startPayment() {
  const status = document.getElementById('checkout-status');
  const providersEl = document.getElementById('payment-providers');
  providersEl.innerHTML = '';
  status.textContent = 'Creating payment sessions...';
  let cartId = localStorage.getItem('medusa_cart_id');
  if (!cartId) {
    try {
      const cart = await medusaService.createCart();
      cartId = cart?.id;
      if (cartId) localStorage.setItem('medusa_cart_id', cartId);
    } catch (e) {}
  }
  if (!cartId) { status.textContent = 'No cart found.'; return; }
  try {
    const cart = await medusaService.createPaymentSessions(cartId);
    const sessions = cart?.payment_sessions || [];
    if (sessions.length) {
      providersEl.innerHTML = 'Providers: ' + sessions.map(s => `<span class="inline-block mr-2 px-2 py-1 border">${s.provider_id}</span>`).join('');
    }
    status.textContent = 'Completing cart...';
    const complete = await medusaService.completeCart(cartId);
    if (complete?.type === 'order' || complete?.data?.id) {
      status.textContent = 'Order created successfully.';
      // Clear cart snapshot
      localStorage.removeItem('medusa_cart_lines');
    } else if (complete?.payment_session?.data?.redirect_url) {
      status.innerHTML = `Redirecting to payment...`;
      window.location.href = complete.payment_session.data.redirect_url;
    } else {
      status.textContent = 'Further payment steps required by provider.';
    }
  } catch (e) {
    status.textContent = 'Payment error. Please try again.';
    console.error(e);
  }
}

