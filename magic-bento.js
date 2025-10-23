// MagicBento: Vanilla JS hover-tilt bento grid
// Usage: wrap cards in a container with [data-magic-bento]; each card has class .mb-card

export function initMagicBento(selector = '[data-magic-bento]') {
  const containers = Array.from(document.querySelectorAll(selector));
  containers.forEach((container) => {
    container.style.perspective = '1000px';
    const cards = Array.from(container.querySelectorAll('.mb-card'));
    cards.forEach((card) => attachTilt(card));
  });

  function attachTilt(card) {
    const damp = parseFloat(card.dataset.tiltDamp || '12');
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1
      const rx = (0.5 - py) * damp; // tilt X
      const ry = (px - 0.5) * damp; // tilt Y
      card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    };
    const onLeave = () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    };
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
  }
}

