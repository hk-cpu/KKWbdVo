// LightRays: simple animated light rays overlay
// Usage: add <div class="light-rays" data-light-rays></div> inside a relative container

export function initLightRays(selector = '[data-light-rays]') {
  const els = Array.from(document.querySelectorAll(selector));
  els.forEach((el) => {
    if (el.dataset.lrApplied) return;
    el.dataset.lrApplied = 'true';

    const count = Number(el.dataset.count || 3);
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.className = 'lr-ray';
      span.style.setProperty('--i', String(i));
      el.appendChild(span);
    }
  });
}

