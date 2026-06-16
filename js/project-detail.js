/* =============================================
   PROJECT-DETAIL.JS
   ============================================= */

'use strict';

// Project data (mirrored from projects.js)
const PROJECT_DETAILS = {
  nexashop: {
    title: 'NexaShop',
    category: 'Full-Stack Development',
    year: '2024',
    duration: '4 months',
    role: 'Lead Developer',
    img: 'assets/images/project1.png',
    overview: `NexaShop is a high-performance e-commerce platform engineered to serve over 10,000 monthly active users with sub-200ms page load times. The platform features AI-powered product recommendations using collaborative filtering, real-time inventory management, and an integrated Stripe payment gateway with automatic fraud detection. The admin dashboard provides deep sales analytics, customer behavior insights, and inventory forecasting.`,
    challenges: [
      'Designing a scalable MongoDB schema for complex product variants and nested categories',
      'Implementing optimistic UI updates with real-time inventory sync across sessions',
      'Integrating Stripe webhooks with idempotency keys for reliable payment processing',
      'Achieving sub-200ms TTFB via Redis caching and CDN optimization strategies',
      'Building the AI recommendation engine without third-party ML infrastructure costs',
    ],
    tags: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Stripe API', 'AWS S3', 'Docker'],
    live: '#',
    github: '#',
    gallery: ['assets/images/project1.png', 'assets/images/project2.png'],
  },
  aivision: {
    title: 'AI Vision Dashboard',
    category: 'Frontend Development',
    year: '2024',
    duration: '3 months',
    role: 'Frontend Engineer',
    img: 'assets/images/project2.png',
    overview: `AI Vision Dashboard is a sophisticated data visualization platform that renders complex machine learning model outputs as interactive, real-time charts and graphs. Built with Vue.js and powered by a Python/TensorFlow backend, it supports live inference streaming via WebSocket, customizable chart types using D3.js, and a flexible widget-based dashboard layout that allows drag-and-drop rearrangement.`,
    challenges: [
      'Synchronizing real-time WebSocket data streams with Vue reactive state without memory leaks',
      'Rendering 50+ simultaneous D3.js charts at 60fps without jank',
      'Designing an accessible color system for data visualization with WCAG AA compliance',
      'Building a drag-and-drop grid system without external dependencies',
      'Serializing complex dashboard layouts to URL state for shareable views',
    ],
    tags: ['Vue.js', 'Python', 'TensorFlow', 'D3.js', 'WebSocket', 'FastAPI', 'Chart.js'],
    live: '#',
    github: '#',
    gallery: ['assets/images/project2.png', 'assets/images/project1.png'],
  },
};

// Fill in remaining projects with generic data
['taskflow','cryptowatch','devlink','motionui'].forEach(id => {
  PROJECT_DETAILS[id] = {
    title: { taskflow:'TaskFlow Pro', cryptowatch:'CryptoWatch', devlink:'DevLink API', motionui:'MotionUI Kit' }[id],
    category: { taskflow:'Full-Stack', cryptowatch:'Frontend', devlink:'Backend', motionui:'Open Source' }[id],
    year: '2023', duration: '3 months', role: 'Lead Developer',
    img: id === 'cryptowatch' || id === 'motionui' ? 'assets/images/project2.png' : 'assets/images/project1.png',
    overview: `A production-grade software project demonstrating advanced engineering practices, clean architecture, and attention to both developer experience and end-user performance. Built with modern tooling and deployed to cloud infrastructure.`,
    challenges: [
      'Architecting a scalable codebase with clear separation of concerns',
      'Implementing efficient state management patterns for complex data flows',
      'Optimizing bundle size and runtime performance for all device types',
      'Writing comprehensive test coverage with CI/CD pipeline integration',
    ],
    tags: { taskflow:['React','Express','PostgreSQL','Socket.io'], cryptowatch:['Next.js','TypeScript','WebSocket','Chart.js'], devlink:['Node.js','GraphQL','Redis','Docker'], motionui:['JavaScript','CSS','GSAP','Webpack'] }[id],
    live: '#', github: '#',
    gallery: ['assets/images/project1.png', 'assets/images/project2.png'],
  };
});

// ─── Render project detail ────────────────────────────────────────────────────
(function renderDetail() {
  const params = new URLSearchParams(location.search);
  const id     = params.get('id') || 'nexashop';
  const p      = PROJECT_DETAILS[id] || PROJECT_DETAILS.nexashop;

  // Title
  document.title = `${p.title} — Raj Desai`;

  const setEl = (sel, val, prop = 'textContent') => {
    const el = document.querySelector(sel);
    if (el) el[prop] = val;
  };

  setEl('.pdetail-category', p.category);
  setEl('.pdetail-title', p.title);
  setEl('[data-pdetail="year"]', p.year);
  setEl('[data-pdetail="duration"]', p.duration);
  setEl('[data-pdetail="role"]', p.role);

  const heroImg = document.querySelector('.pdetail-hero-img img');
  if (heroImg) { heroImg.src = p.img; heroImg.alt = p.title; }

  setEl('.pdetail-overview', p.overview);

  const chalList = document.querySelector('.pdetail-challenges ul');
  if (chalList) {
    chalList.innerHTML = p.challenges.map(c => `<li>${c}</li>`).join('');
  }

  const techList = document.querySelector('.pdetail-tech-list');
  if (techList) {
    techList.innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
  }

  const gallery = document.querySelector('.pdetail-gallery');
  if (gallery) {
    gallery.innerHTML = p.gallery.map(img => `<img src="${img}" alt="${p.title} screenshot" loading="lazy">`).join('');
  }

  // Update live/github links
  document.querySelectorAll('.pdetail-link-btn').forEach((btn, i) => {
    btn.href = i === 0 ? p.live : p.github;
  });
})();
