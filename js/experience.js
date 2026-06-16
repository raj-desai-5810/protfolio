/* =============================================
   EXPERIENCE.JS
   ============================================= */

'use strict';

// ─── Timeline reveal animation ────────────────────────────────────────────────
(function initTimelineReveal() {
  const items = document.querySelectorAll('.exp-item');
  if (!items.length) return;

  items.forEach((item, i) => {
    item.style.opacity = '0';
    // Alternate left/right entrance
    item.style.transform = i % 2 === 0
      ? 'translateX(-40px)'
      : 'translateX(40px)';
    item.style.transition = `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`;
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => obs.observe(item));
})();

// ─── Achievement card hover micro-interaction ─────────────────────────────────
document.querySelectorAll('.ach-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── Dot pulse on timeline item hover ────────────────────────────────────────
// (Handled by CSS :hover — no extra JS needed)

// ─── Scroll-based spine progress ─────────────────────────────────────────────
(function spineProgress() {
  const timeline = document.querySelector('.exp-timeline');
  if (!timeline) return;

  // Add a secondary progress bar that fills on scroll
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:absolute;left:50%;top:0;width:2px;height:0%;
    background:rgba(108,99,255,0.6);transform:translateX(-50%);
    z-index:1;pointer-events:none;transition:height 0.1s linear;
    box-shadow:0 0 8px rgba(108,99,255,0.5);
  `;
  timeline.style.position = 'relative';
  timeline.appendChild(bar);

  function updateBar() {
    const rect = timeline.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalH = rect.height;
    const scrolled = Math.max(0, windowH - rect.top);
    const pct = Math.min(scrolled / (totalH + windowH) * 160, 100);
    bar.style.height = pct + '%';
  }

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
})();
