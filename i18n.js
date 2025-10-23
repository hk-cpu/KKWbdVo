const dict = {
  en: {
    'nav.home': 'Home',
    'nav.collections': 'Collections',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'hero.title': 'Where Essence Meets Elegance',
    'hero.cta': 'Shop Now',
    'section.featured': 'Featured Collections',
    'section.featured.desc': 'Discover our latest creations, where timeless design meets contemporary craftsmanship.',
    'section.story': 'Our Story',
    'collections.title': 'The Signature Collection',
    'collections.subtitle': 'Timeless pieces that define the essence of FORMA% HAUS.',
    'bento.title': 'Magic Bento',
    'bento.desc': 'Interactive highlights powered by CSS & JS.',
    'bento.new': 'New Arrivals',
    'bento.new.desc': 'Explore the latest drops.',
    'bento.signature': 'Signature Edit',
    'bento.signature.desc': 'Timeless pieces reimagined.',
    'bento.essentials': 'Essentials',
    'bento.essentials.desc': 'Elevated everyday staples.',
    'bento.accessories': 'Accessories',
    'bento.accessories.desc': 'Finishing touches that shine.',
    'checkout.title': 'Checkout',
    'checkout.pay': 'Proceed to Payment',
    'lang.en': 'EN',
    'lang.ar': 'AR'
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.collections': 'المجموعات',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'hero.title': 'حيث تلتقي الجوهر بالأناقة',
    'hero.cta': 'تسوق الآن',
    'section.featured': 'المجموعات المميزة',
    'section.featured.desc': 'اكتشف أحدث إبداعاتنا حيث يلتقي التصميم الخالد بالحرفة المعاصرة.',
    'section.story': 'قصتنا',
    'collections.title': 'مجموعة التوقيع',
    'collections.subtitle': 'قطع خالدة تجسد جوهر FORMA% HAUS.',
    'bento.title': 'شبكة بصرية',
    'bento.desc': 'لمسات تفاعلية مدعومة بـ CSS وJS.',
    'bento.new': 'وصل حديثًا',
    'bento.new.desc': 'استكشف أحدث الإصدارات.',
    'bento.signature': 'توقيع',
    'bento.signature.desc': 'قطع خالدة برؤية جديدة.',
    'bento.essentials': 'أساسيات',
    'bento.essentials.desc': 'أساسيات يومية راقية.',
    'bento.accessories': 'إكسسوارات',
    'bento.accessories.desc': 'لمسات نهائية متألقة.',
    'checkout.title': 'الدفع',
    'checkout.pay': 'المتابعة للدفع',
    'lang.en': 'EN',
    'lang.ar': 'ع'
  }
};

export function getLang() {
  return localStorage.getItem('lang') || 'en';
}

export function setLang(lang) {
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

export function t(key) {
  const lang = getLang();
  return (dict[lang] && dict[lang][key]) || dict.en[key] || key;
}

export function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]')?.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    el.textContent = t(key);
  });
}

