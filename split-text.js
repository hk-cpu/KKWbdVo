// Lightweight SplitText utility for non-React usage
// Usage: applySplitText('[data-split-text]')
export function applySplitText(selector = '[data-split-text]') {
  const nodes = Array.from(document.querySelectorAll(selector));
  nodes.forEach((node) => {
    if (!node || node.dataset.splitApplied) return;
    const text = node.textContent || '';
    const frag = document.createDocumentFragment();
    for (const ch of text) {
      const span = document.createElement('span');
      span.className = 'split-char inline-block will-change-transform';
      span.textContent = ch;
      frag.appendChild(span);
    }
    node.textContent = '';
    node.appendChild(frag);
    node.dataset.splitApplied = 'true';
  });
}

