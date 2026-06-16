/* =============================================
   CONTACT.JS
   ============================================= */

'use strict';

// ─── Particle canvas background ───────────────────────────────────────────────
(function initContactCanvas() {
  const canvas = document.getElementById('contact-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    initParticles();
  }

  function initParticles() {
    particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.5 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: 0.15 + Math.random() * 0.4,
      hue: Math.random() < 0.6 ? 252 : 185, // violet or cyan
    }));
  }

  function drawLine(a, b) {
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    if (dist > 120) return;
    const alpha = (1 - dist / 120) * 0.15;
    ctx.strokeStyle = `rgba(108,99,255,${alpha})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        drawLine(p, particles[j]);
      }
    });

    requestAnimationFrame(tick);
  }

  resize();
  tick();
  window.addEventListener('resize', resize, { passive: true });
})();

// ─── Floating labels ──────────────────────────────────────────────────────────
document.querySelectorAll('.form-group').forEach(group => {
  const input = group.querySelector('.form-input');
  if (!input) return;

  const checkFilled = () => {
    group.classList.toggle('filled', input.value.trim().length > 0);
  };

  input.addEventListener('focus', () => {
    group.classList.add('focused');
  });
  input.addEventListener('blur', () => {
    group.classList.remove('focused');
    checkFilled();
  });
  input.addEventListener('input', checkFilled);
  checkFilled();
});

// ─── Form submission (demo) ────────────────────────────────────────────────────
(function initForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('contact-toast');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.classList.add('loading');
    btn.textContent = 'Sending…';

    // Simulate async send
    setTimeout(() => {
      btn.classList.remove('loading');
      btn.innerHTML = 'Message Sent! <span class="submit-arrow">✓</span>';
      btn.style.background = 'linear-gradient(135deg,#00FFB3,#00D4FF)';
      form.reset();
      document.querySelectorAll('.form-group').forEach(g => g.classList.remove('filled'));

      // Toast notification
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
      }

      // Reset button after delay
      setTimeout(() => {
        btn.innerHTML = 'Send Message <span class="submit-arrow">→</span>';
        btn.style.background = '';
      }, 3500);
    }, 1800);
  });
})();

// ─── Social link hover ripple ─────────────────────────────────────────────────
document.querySelectorAll('.social-link').forEach((link, i) => {
  link.style.animationDelay = `${i * 0.1}s`;
});
