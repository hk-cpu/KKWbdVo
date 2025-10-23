// ScrollVelocity: Vanilla JS marquee that reacts to scroll speed
// Usage: add [data-scroll-velocity] to a container with inline text
// Optional: data-speed="0.6" (pixels per frame)

export function initScrollVelocity(selector = '[data-scroll-velocity]') {
  const els = Array.from(document.querySelectorAll(selector));
  els.forEach((el) => setup(el));

  let lastY = window.scrollY;
  let lastT = performance.now();
  let deltaY = 0;

  window.addEventListener('scroll', () => {
    const now = performance.now();
    const y = window.scrollY;
    const dt = Math.max(16, now - lastT);
    deltaY = (y - lastY) / dt; // px per ms
    lastY = y;
    lastT = now;
  }, { passive: true });

  function setup(container) {
    if (container.dataset.svApplied) return;
    container.dataset.svApplied = 'true';
    const base = parseFloat(container.dataset.speed || '0.6'); // px per frame
    const content = container.textContent || '';

    const trackA = document.createElement('span');
    const trackB = document.createElement('span');
    trackA.className = 'sv-track';
    trackB.className = 'sv-track';
    trackA.textContent = content + ' ';
    trackB.textContent = content + ' ';

    container.textContent = '';
    container.appendChild(trackA);
    container.appendChild(trackB);

    let xA = 0;
    let xB = 0;
    let width = 0;
    let velocity = base;

    const measure = () => {
      width = trackA.offsetWidth || 0;
      xA = 0;
      xB = width;
    };
    measure();
    window.addEventListener('resize', measure);

    const step = () => {
      // Smoothly react to scroll delta
      const target = base + Math.max(-1, Math.min(1, deltaY * 60)) * base * 0.5; // clamp
      velocity += (target - velocity) * 0.08; // ease toward target

      xA -= velocity;
      xB -= velocity;
      if (width > 0) {
        if (xA <= -width) xA += width;
        if (xB <= -width) xB += width;
      }
      trackA.style.transform = `translate3d(${xA}px,0,0)`;
      trackB.style.transform = `translate3d(${xB}px,0,0)`;
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

