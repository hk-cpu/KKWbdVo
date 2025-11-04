import medusaService from './medusa-service.js';
import { applyI18n, getLang, setLang } from './i18n.js';

let currentCart = null;
let selectedShippingOption = null;
let currentStep = 1; // Track current checkout step

document.addEventListener('DOMContentLoaded', () => {
  try { lucide.createIcons(); } catch {}
  setLang(getLang());
  applyI18n(document);
  initAdminLink();
  renderCart();
  initProgressIndicator();
  initFormValidation();
  
  const btn = document.getElementById('start-payment');
  if (btn) btn.addEventListener('click', startPayment);
  
  // Auto-load shipping options when address is complete
  document.querySelectorAll('#customer-email, #first-name, #last-name, #address-1, #city, #postal-code, #country-code').forEach(input => {
    input.addEventListener('blur', autoLoadShipping);
  });
  
  // Language toggle
  const langToggle = document.getElementById('lang-toggle');
  const labelEn = document.getElementById('lang-label-en');
  const labelAr = document.getElementById('lang-label-ar');
  
  if (langToggle) {
    // Set initial state based on current language
    const currentLang = getLang();
    langToggle.checked = currentLang === 'ar';
    
    // Update labels
    if (labelEn && labelAr) {
      if (currentLang === 'ar') {
        labelEn.classList.add('hidden');
        labelAr.classList.remove('hidden');
        labelAr.classList.add('flex');
      } else {
        labelEn.classList.remove('hidden');
        labelEn.classList.add('flex');
        labelAr.classList.add('hidden');
      }
    }
    
    // Listen for changes
    langToggle.addEventListener('change', (e) => {
      setLang(e.target.checked ? 'ar' : 'en');
      applyI18n(document);
      
      // Toggle labels
      if (labelEn && labelAr) {
        if (e.target.checked) {
          labelEn.classList.add('hidden');
          labelAr.classList.remove('hidden');
          labelAr.classList.add('flex');
        } else {
          labelEn.classList.remove('hidden');
          labelEn.classList.add('flex');
          labelAr.classList.add('hidden');
        }
      }
    });
  }
});

function initProgressIndicator() {
  updateProgressStep(1);
}

function updateProgressStep(step) {
  currentStep = step;
  const progressLine = document.getElementById('progress-line');
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');
  
  // Update progress line width
  if (progressLine) {
    progressLine.style.width = step === 1 ? '0%' : step === 2 ? '50%' : '100%';
  }
  
  // Update step indicators
  [step1, step2, step3].forEach((el, idx) => {
    if (!el) return;
    const stepNum = idx + 1;
    
    if (stepNum < step) {
      // Completed step
      el.className = 'w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-lg border-4 border-off-white transition-all duration-300';
      el.innerHTML = '✓';
    } else if (stepNum === step) {
      // Current step
      el.className = 'w-12 h-12 rounded-full bg-soft-gold text-white flex items-center justify-center font-semibold text-lg border-4 border-off-white transition-all duration-300';
      el.innerHTML = stepNum;
    } else {
      // Future step
      el.className = 'w-12 h-12 rounded-full bg-gray-300 text-charcoal flex items-center justify-center font-semibold text-lg border-4 border-off-white transition-all duration-300';
      el.innerHTML = stepNum;
    }
  });
}

function initFormValidation() {
  const requiredFields = document.querySelectorAll('input[required]');
  
  requiredFields.forEach(field => {
    field.addEventListener('invalid', (e) => {
      e.preventDefault();
      field.classList.add('border-red-500');
      showFieldError(field, 'This field is required');
    });
    
    field.addEventListener('input', () => {
      field.classList.remove('border-red-500');
      hideFieldError(field);
    });
  });
  
  // Email validation
  const emailField = document.getElementById('customer-email');
  if (emailField) {
    emailField.addEventListener('blur', () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailField.value && !emailPattern.test(emailField.value)) {
        emailField.classList.add('border-red-500');
        showFieldError(emailField, 'Please enter a valid email address');
      }
    });
  }
  
  // Country code validation
  const countryField = document.getElementById('country-code');
  if (countryField) {
    countryField.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase();
    });
    
    countryField.addEventListener('blur', () => {
      if (countryField.value && countryField.value.length !== 2) {
        countryField.classList.add('border-red-500');
        showFieldError(countryField, 'Please enter a 2-letter country code (e.g., US, UK)');
      }
    });
  }
}

function showFieldError(field, message) {
  hideFieldError(field);
  const error = document.createElement('div');
  error.className = 'field-error text-xs text-red-600 mt-1';
  error.textContent = message;
  field.parentNode.appendChild(error);
}

function hideFieldError(field) {
  const error = field.parentNode.querySelector('.field-error');
  if (error) error.remove();
}

async function autoLoadShipping() {
  const customerData = collectCustomerData();
  if (!customerData) return;
  
  let cartId = localStorage.getItem('medusa_cart_id');
  if (!cartId) {
    try {
      const cart = await medusaService.createCart();
      cartId = cart?.id;
      if (cartId) localStorage.setItem('medusa_cart_id', cartId);
    } catch (e) {
      console.error('Failed to create cart:', e);
      return;
    }
  }
  
  if (!cartId) return;
  
  try {
    currentCart = await medusaService.updateCart(cartId, customerData);
    await loadShippingOptions(cartId);
    updateProgressStep(2); // Move to payment step
  } catch (e) {
    console.error('Auto-load shipping failed:', e);
  }
}

function initAdminLink() {
  const adminLink = document.getElementById('admin-link');
  try {
    const url = import.meta?.env?.VITE_MEDUSA_ADMIN_URL;
    if (adminLink && url) { adminLink.href = url; adminLink.classList.remove('hidden'); }
  } catch {}
}

function renderCart() {
  const itemsEl = document.getElementById('checkout-items');
  const subtotalEl = document.getElementById('checkout-subtotal');
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
  
  const subtotal = items.reduce((a, l) => a + (parseFloat(l.price || 0) * (l.quantity || 1)), 0);
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

function collectCustomerData() {
  const email = document.getElementById('customer-email')?.value;
  const firstName = document.getElementById('first-name')?.value;
  const lastName = document.getElementById('last-name')?.value;
  const address1 = document.getElementById('address-1')?.value;
  const address2 = document.getElementById('address-2')?.value;
  const city = document.getElementById('city')?.value;
  const postalCode = document.getElementById('postal-code')?.value;
  const countryCode = document.getElementById('country-code')?.value?.toUpperCase();

  if (!email || !firstName || !lastName || !address1 || !city || !postalCode || !countryCode) {
    return null;
  }

  return {
    email,
    shipping_address: {
      first_name: firstName,
      last_name: lastName,
      address_1: address1,
      address_2: address2 || '',
      city,
      postal_code: postalCode,
      country_code: countryCode
    }
  };
}

async function loadShippingOptions(cartId) {
  try {
    const options = await medusaService.listShippingOptions(cartId);
    const optionsEl = document.getElementById('shipping-options');
    
    if (!options || options.length === 0) {
      optionsEl.innerHTML = '<div class="text-sm opacity-70">No shipping options available. Please enter your address first.</div>';
      return;
    }

    optionsEl.innerHTML = options.map(opt => `
      <label class="flex items-center gap-3 p-3 border border-gray-300 cursor-pointer hover:bg-gray-50">
        <input type="radio" name="shipping-option" value="${opt.id}" class="shipping-option-radio" />
        <div class="flex-1">
          <div class="text-sm font-medium">${opt.name}</div>
        </div>
        <div class="text-sm font-semibold">$${((opt.amount || 0) / 100).toFixed(2)}</div>
      </label>
    `).join('');

    // Add event listeners to shipping options
    document.querySelectorAll('.shipping-option-radio').forEach(radio => {
      radio.addEventListener('change', async (e) => {
        selectedShippingOption = e.target.value;
        await updateShippingMethod(cartId, selectedShippingOption);
      });
    });
  } catch (e) {
    console.error('Failed to load shipping options:', e);
  }
}

async function updateShippingMethod(cartId, optionId) {
  try {
    const status = document.getElementById('checkout-status');
    status.textContent = 'Updating shipping method...';
    
    currentCart = await medusaService.addShippingMethod(cartId, optionId);
    
    // Update totals
    updateTotals(currentCart);
    status.textContent = '';
  } catch (e) {
    console.error('Failed to update shipping method:', e);
    document.getElementById('checkout-status').textContent = 'Failed to update shipping. Please try again.';
  }
}

function updateTotals(cart) {
  const subtotalEl = document.getElementById('checkout-subtotal');
  const shippingEl = document.getElementById('checkout-shipping');
  const totalEl = document.getElementById('checkout-total');

  if (cart) {
    const subtotal = (cart.subtotal || 0) / 100;
    const shipping = (cart.shipping_total || 0) / 100;
    const total = (cart.total || 0) / 100;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  }
}

async function startPayment() {
  const status = document.getElementById('checkout-status');
  const providersEl = document.getElementById('payment-providers');
  const btn = document.getElementById('start-payment');
  providersEl.innerHTML = '';
  
  // Disable button to prevent double-click
  if (btn) {
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');
  }
  
  // Step 1: Validate and collect customer data
  const customerData = collectCustomerData();
  if (!customerData) {
    status.textContent = '❌ Please fill in all required fields.';
    status.className = 'mt-4 text-sm text-red-600 font-medium';
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    // Scroll to first empty field
    scrollToFirstError();
    return;
  }

  status.textContent = '⏳ Processing checkout...';
  status.className = 'mt-4 text-sm text-gray-600';

  let cartId = localStorage.getItem('medusa_cart_id');
  
  // Step 2: Create or get cart
  if (!cartId) {
    try {
      const cart = await medusaService.createCart();
      cartId = cart?.id;
      if (cartId) localStorage.setItem('medusa_cart_id', cartId);
    } catch (e) {
      console.error('Failed to create cart:', e);
    }
  }

  if (!cartId) {
    status.textContent = '❌ No cart found. Please add items to your cart.';
    status.className = 'mt-4 text-sm text-red-600 font-medium';
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    return;
  }

  try {
    // Step 3: Update cart with customer info and address
    status.textContent = '⏳ Updating customer information...';
    currentCart = await medusaService.updateCart(cartId, customerData);

    // Step 4: Check if shipping method is selected
    if (!selectedShippingOption) {
      status.textContent = '⏳ Loading shipping options...';
      await loadShippingOptions(cartId);
      status.textContent = '⚠️  Please select a shipping method to continue.';
      status.className = 'mt-4 text-sm text-yellow-600 font-medium';
      if (btn) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
      return;
    }

    // Step 5: Move to payment step
    updateProgressStep(2);
    
    // Step 6: Create payment sessions
    status.textContent = '⏳ Creating payment sessions...';
    currentCart = await medusaService.createPaymentSessions(cartId);
    
    const sessions = currentCart?.payment_sessions || [];
    if (sessions.length) {
      providersEl.innerHTML = '<div class="font-medium mb-2 text-sm">✓ Available payment methods:</div>' + 
        sessions.map(s => `<span class="inline-block mr-2 px-3 py-1 text-xs border border-gray-300 bg-white rounded">${s.provider_id}</span>`).join('');
    }

    // Step 7: Complete cart
    status.textContent = '⏳ Completing order...';
    const complete = await medusaService.completeCart(cartId);
    
    if (complete?.type === 'order' || complete?.data?.id) {
      // Success!
      updateProgressStep(3);
      status.textContent = '✅ Order created successfully! Redirecting...';
      status.className = 'mt-4 text-sm text-green-600 font-semibold';
      
      // Clear cart
      localStorage.removeItem('medusa_cart_lines');
      localStorage.removeItem('medusa_cart_id');
      
      setTimeout(() => {
        window.location.href = 'index.html?order=success';
      }, 2000);
    } else if (complete?.payment_session?.data?.redirect_url) {
      status.innerHTML = '⏳ Redirecting to payment provider...';
      status.className = 'mt-4 text-sm text-blue-600';
      window.location.href = complete.payment_session.data.redirect_url;
    } else {
      status.textContent = '⚠️  Further payment steps required. Please contact support.';
      status.className = 'mt-4 text-sm text-yellow-600';
      if (btn) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }
  } catch (e) {
    status.textContent = '❌ Payment error: ' + (e.message || 'Please try again.');
    status.className = 'mt-4 text-sm text-red-600 font-medium';
    console.error('Checkout error:', e);
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }
}

function scrollToFirstError() {
  const firstRequired = document.querySelector('input[required]:invalid, input[required]:not([value])');
  if (firstRequired) {
    firstRequired.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstRequired.focus();
  }
}


