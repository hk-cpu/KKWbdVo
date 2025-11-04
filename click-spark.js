/**
 * ClickSpark Animation
 * Creates a spark effect on click/tap
 * Based on reactbits.dev ClickSpark animation
 */

export function initClickSpark(selector = 'body') {
  const targetElement = typeof selector === 'string' 
    ? document.querySelector(selector) 
    : selector;

  if (!targetElement) return;

  targetElement.addEventListener('click', (e) => {
    createSpark(e.clientX, e.clientY);
  });
}

function createSpark(x, y) {
  const spark = document.createElement('div');
  spark.className = 'click-spark';
  
  // Random number of particles (8-12)
  const particleCount = Math.floor(Math.random() * 5) + 8;
  
  // Create particle container
  spark.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    pointer-events: none;
    z-index: 9999;
  `;
  
  document.body.appendChild(spark);
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 50 + Math.random() * 50; // 50-100px
    const size = 3 + Math.random() * 3; // 3-6px
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: var(--color-soft-gold, #D4AF37);
      border-radius: 50%;
      left: -${size / 2}px;
      top: -${size / 2}px;
      animation: spark-particle 0.6s ease-out forwards;
      --tx: ${Math.cos(angle) * velocity}px;
      --ty: ${Math.sin(angle) * velocity}px;
    `;
    
    spark.appendChild(particle);
  }
  
  // Remove after animation
  setTimeout(() => {
    spark.remove();
  }, 600);
}

// Add CSS for animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spark-particle {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(var(--tx), var(--ty)) scale(0);
      opacity: 0;
    }
  }
  
  .click-spark {
    animation: spark-fade 0.6s ease-out forwards;
  }
  
  @keyframes spark-fade {
    to {
      opacity: 0;
    }
  }
`;

if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}

// Auto-initialize on body for all clicks
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize on body to catch all clicks
    initClickSpark('body');
  });
}

export { createSpark };
