/**
 * main.js — Site-Wide Interactions
 * Handles: nav scroll state, mobile menu, reveal animations,
 * skill bar animations, project filter, contact form, page transitions.
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════
     1. NAVBAR — scroll state + mobile toggle
  ══════════════════════════════════════════ */
  const navbar   = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);

      // Animate hamburger → X
      const spans = navToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });
  }

  /* ══════════════════════════════════════════
     2. SCROLL REVEAL — Intersection Observer
  ══════════════════════════════════════════ */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ══════════════════════════════════════════
     3. SKILL BAR ANIMATIONS
  ══════════════════════════════════════════ */
  const skillBars = document.querySelectorAll('.skill-bar');

  if (skillBars.length > 0) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar   = entry.target;
          const width = bar.dataset.width || '80';
          bar.style.width = width + '%';
          bar.classList.add('animated');
          barObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => {
      bar.style.width = '0%';
      barObserver.observe(bar);
    });
  }

  /* ══════════════════════════════════════════
     4. PROJECT FILTER
  ══════════════════════════════════════════ */
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const projectBlocks = document.querySelectorAll('.project-block');

  if (filterBtns.length > 0 && projectBlocks.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter projects
        projectBlocks.forEach(block => {
          const category = block.dataset.category;
          const show = filter === 'all' || category === filter;

          block.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

          if (show) {
            block.style.opacity   = '1';
            block.style.transform = 'translateY(0)';
            block.style.display   = '';
          } else {
            block.style.opacity   = '0';
            block.style.transform = 'translateY(20px)';
            setTimeout(() => {
              if (btn.dataset.filter !== 'all' && block.dataset.category !== btn.dataset.filter) {
                block.style.display = 'none';
              }
            }, 350);
          }
        });
      });
    });
  }

  /* ══════════════════════════════════════════
     5. CONTACT FORM — client-side demo
  ══════════════════════════════════════════ */
  const contactForm   = document.getElementById('contact-form');
  const formSuccess   = document.getElementById('form-success');
  const submitBtn     = document.getElementById('submit-btn');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simulate async submission
      if (submitBtn) {
        submitBtn.disabled     = true;
        submitBtn.textContent  = 'Sending…';
      }

      setTimeout(() => {
        contactForm.style.display  = 'none';
        formSuccess.classList.add('visible');
      }, 1200);
    });
  }

  /* ══════════════════════════════════════════
     6. FLOATING LABEL FALLBACK
     (ensures labels float on autofill)
  ══════════════════════════════════════════ */
  document.querySelectorAll('.form-field input, .form-field textarea').forEach(input => {
    const checkFilled = () => {
      if (input.value.length > 0) {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    };

    input.addEventListener('change', checkFilled);
    input.addEventListener('blur', checkFilled);
    checkFilled();
  });

  /* ══════════════════════════════════════════
     7. ACTIVE NAV LINK — based on current page
  ══════════════════════════════════════════ */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* ══════════════════════════════════════════
     8. SMOOTH ENTRANCE — body fade in
  ══════════════════════════════════════════ */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';

  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  // Trigger immediately if already loaded
  if (document.readyState !== 'loading') {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  }

  /* ══════════════════════════════════════════
     9. PAGE LINK TRANSITIONS
  ══════════════════════════════════════════ */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');

    // Only handle same-origin, non-anchor, non-external links
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !href.startsWith('mailto') &&
      !href.startsWith('tel') &&
      href.endsWith('.html')
    ) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.opacity = '0';
        setTimeout(() => {
          window.location.href = href;
        }, 320);
      });
    }
  });

  /* ══════════════════════════════════════════
     10. STAGGER CHILDREN on hover — work list
  ══════════════════════════════════════════ */
  document.querySelectorAll('.work-item').forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.04}s`;
  });

  /* ══════════════════════════════════════════
     11. TIMELINE — stagger on scroll
  ══════════════════════════════════════════ */
  document.querySelectorAll('.timeline-entry').forEach((entry, i) => {
    entry.setAttribute('data-reveal-delay', String(i));
  });

  /* ══════════════════════════════════════════
     12. CURSOR ATTENTION for expertise cards
  ══════════════════════════════════════════ */
  document.querySelectorAll('.expertise-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();
