import { animate, inView } from 'https://esm.run/framer-motion';
import { applyI18n, getLang, setLang } from './i18n.js';
import { initClickSpark } from './click-spark.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    try { lucide.createIcons(); } catch {}
    
    // Initialize i18n
    setLang(getLang());
    applyI18n(document);
    
    // Initialize header scroll behavior
    initHeaderScroll();
    
    // Initialize animations
    initScrollAnimations();
    
    // Initialize mobile menu
    initMobileMenu();
});

function initHeaderScroll() {
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
}

function initScrollAnimations() {
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
}

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.md\\:hidden button');
    const nav = document.querySelector('nav.hidden.md\\:flex');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('hidden');
            nav.classList.toggle('flex');
            nav.classList.toggle('fixed');
            nav.classList.toggle('inset-0');
            nav.classList.toggle('bg-off-white');
            nav.classList.toggle('flex-col');
            nav.classList.toggle('items-center');
            nav.classList.toggle('justify-center');
            nav.classList.toggle('z-50');
        });
    }
}
