import { animate, inView } from 'https://esm.run/framer-motion';
import medusaService from './medusa-service.js';
import { applyI18n, getLang, setLang } from './i18n.js';
import { applySplitText } from './split-text.js';

let currentProduct = null;
let selectedVariantId = null;

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    setLang(getLang());
    applyI18n(document);
    
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

    // Load product based on URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productHandle = urlParams.get('handle');
    
    if (productHandle) {
        loadProductDetails(productHandle);
    }

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
        }, { margin: "-10% 0px -10% 0px" });
    });
});

async function loadProductDetails(handle) {
    try {
        const product = await medusaService.getProductByHandle(handle);
        if (product) {
            currentProduct = product;
            updateProductPage(product);
        } else {
            document.getElementById('product-detail').innerHTML = '<p class="text-center col-span-2">Product not found.</p>';
        }
    } catch (error) {
        console.error('Error loading product:', error);
        document.getElementById('product-detail').innerHTML = '<p class="text-center col-span-2">Error loading product details.</p>';
    }
}

function updateProductPage(product) {
    // Update product title
    document.getElementById('product-title').textContent = product.title;
    
    // Update product price
    const priceElement = document.getElementById('product-price');
    const allPrices = (product.variants || []).flatMap(v => (v.prices || []).map(pr => ({ amount: pr.amount, currency: pr.currency_code })));
    if (allPrices.length) {
        const lowest = allPrices.reduce((m, a) => a.amount < m.amount ? a : m, allPrices[0]);
        priceElement.textContent = `$${(lowest.amount / 100).toFixed(2)} ${lowest.currency?.toUpperCase() || ''}`;
    }
    
    // Update product description
    document.getElementById('product-description').textContent = product.description;
    
    // Update product images
    const imagesContainer = document.querySelector('#product-images .swiper-wrapper');
    if ((product.images || []).length > 0) {
        imagesContainer.innerHTML = product.images.map(img => `
            <div class="swiper-slide">
                <img src="${img.url}" alt="${product.title}" class="w-full h-auto object-cover">
            </div>
        `).join('');
    }
    
    // Update product variants
    const variantsContainer = document.getElementById('product-variants');
    if ((product.variants || []).length > 0) {
        variantsContainer.innerHTML = product.variants.map(variant => `
            <button class="variant-option px-4 py-2 border border-mid-grey hover:border-charcoal transition-colors" 
                    data-variant-id="${variant.id}">
                ${variant.title}
            </button>
        `).join('');

        document.querySelectorAll('.variant-option').forEach(button => {
            button.addEventListener('click', function() {
                document.querySelectorAll('.variant-option').forEach(btn => {
                    btn.classList.remove('border-charcoal', 'bg-charcoal', 'text-off-white');
                    btn.classList.add('border-mid-grey');
                });
                this.classList.remove('border-mid-grey');
                this.classList.add('border-charcoal', 'bg-charcoal', 'text-off-white');
                selectedVariantId = this.dataset.variantId;
            });
        });

        const first = document.querySelector('.variant-option');
        if (first) first.click();
    }
    
    // Add to cart functionality
    document.getElementById('add-to-cart').addEventListener('click', async () => {
        if (selectedVariantId) {
            try {
                // Reuse existing cart or create new
                let cartId = localStorage.getItem('medusa_cart_id');
                if (!cartId) {
                    const cart = await medusaService.createCart();
                    cartId = cart?.id || null;
                    if (cartId) localStorage.setItem('medusa_cart_id', cartId);
                }
                if (!cartId) throw new Error('Failed to create cart');

                const updatedCart = await medusaService.addToCart(cartId, selectedVariantId, 1);
                if (updatedCart) {
                    const items = (updatedCart.items || []).map(it => ({
                        id: it.id,
                        quantity: it.quantity,
                        title: it.title,
                        variant: it.variant?.title,
                        price: ((it?.unit_price || 0) / 100).toFixed(2),
                        currency: (it?.currency_code || '').toUpperCase(),
                        image: it.thumbnail || (it?.variant?.product?.images?.[0]?.url || '')
                    }));
                    localStorage.setItem('medusa_cart_lines', JSON.stringify(items));
                    window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count: items.reduce((a, l) => a + (l.quantity || 0), 0) } }));
                    alert('Product added to cart!');
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                alert('Failed to add product to cart.');
            }
        }
    });
}
    // Language toggle buttons
    const en = document.getElementById('lang-en');
    const ar = document.getElementById('lang-ar');
    if (en) en.addEventListener('click', () => { setLang('en'); applyI18n(document); });
    if (ar) ar.addEventListener('click', () => { setLang('ar'); applyI18n(document); });
