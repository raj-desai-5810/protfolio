/* =============================================
   ABOUT.JS
   ============================================= */

'use strict';

// ─── Animated intro image parallax ───────────────────────────────────────────
(function storyParallax() {
  const imgs = document.querySelectorAll('.story-img-wrap img');
  if (!imgs.length) return;

  window.addEventListener('scroll', () => {
    imgs.forEach(img => {
      const rect = img.closest('.story-img-wrap').getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const shift  = center * 0.08;
      img.style.transform = `translateY(${shift}px) scale(1.05)`;
    });
  }, { passive: true });
})();

// ─── Value cards tilt ─────────────────────────────────────────────────────────
document.querySelectorAll('.value-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -14;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── Timeline item stagger reveal ────────────────────────────────────────────
(function timelineReveal() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = i % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)';
    item.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`;
    item.classList.add('tl-pending');
    obs.observe(item);
  });

  // Handle revealed class
  const style = document.createElement('style');
  style.textContent = '.timeline-item.revealed { opacity: 1 !important; transform: none !important; }';
  document.head.appendChild(style);
})();

// ─── Stats counter (about page specific) ─────────────────────────────────────
// (handled by global.js)
