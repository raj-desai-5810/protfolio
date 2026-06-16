/* =============================================
   PROJECTS.JS
   ============================================= */

'use strict';

// ─── Project data ─────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 'nexashop',
    title: 'NexaShop',
    category: 'Full-Stack',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    desc: 'A premium e-commerce platform with real-time inventory, AI-powered recommendations, and seamless payment processing serving 10K+ monthly users.',
    img: 'assets/images/project1.png',
    live: '#',
    github: '#',
    color: 'violet',
  },
  {
    id: 'aivision',
    title: 'AI Vision Dashboard',
    category: 'Frontend',
    tags: ['Vue.js', 'Python', 'TensorFlow', 'D3.js'],
    desc: 'Interactive analytics dashboard powered by machine learning for real-time data visualization and predictive insights.',
    img: 'assets/images/project2.png',
    live: '#',
    github: '#',
    color: 'cyan',
  },
  {
    id: 'taskflow',
    title: 'TaskFlow Pro',
    category: 'Full-Stack',
    tags: ['React', 'Express', 'PostgreSQL', 'Socket.io'],
    desc: 'A collaborative project management tool with real-time updates, Kanban boards, Gantt charts, and team analytics.',
    img: 'assets/images/project1.png',
    live: '#',
    github: '#',
    color: 'coral',
  },
  {
    id: 'cryptowatch',
    title: 'CryptoWatch',
    category: 'Frontend',
    tags: ['Next.js', 'TypeScript', 'WebSocket', 'Chart.js'],
    desc: 'A live cryptocurrency tracking application with portfolio management, price alerts, and detailed market analytics.',
    img: 'assets/images/project2.png',
    live: '#',
    github: '#',
    color: 'green',
  },
  {
    id: 'devlink',
    title: 'DevLink API',
    category: 'Backend',
    tags: ['Node.js', 'GraphQL', 'Redis', 'Docker'],
    desc: 'A scalable REST & GraphQL API backend with JWT authentication, rate limiting, Redis caching, and comprehensive documentation.',
    img: 'assets/images/project1.png',
    live: '#',
    github: '#',
    color: 'violet',
  },
  {
    id: 'motionui',
    title: 'MotionUI Kit',
    category: 'Tools',
    tags: ['JavaScript', 'CSS', 'GSAP', 'Webpack'],
    desc: 'An open-source animation library with 50+ pre-built components, scroll triggers, and smooth transition utilities.',
    img: 'assets/images/project2.png',
    live: '#',
    github: '#',
    color: 'cyan',
  },
];

// ─── Render project cards ─────────────────────────────────────────────────────
function renderProjects(filter = 'All') {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const filtered = filter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === filter);

  grid.innerHTML = '';
  filtered.forEach((p, i) => {
    const tagHtml = p.tags.map(t => `<span class="tag ${i % 3 === 0 ? '' : i % 3 === 1 ? 'tag-cyan' : 'tag-coral'}">${t}</span>`).join('');
    const card = document.createElement('article');
    card.className = 'project-card reveal';
    card.dataset.tilt = '';
    card.style.transitionDelay = `${i * 0.08}s`;
    card.innerHTML = `
      <div class="project-card-img">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
        <div class="project-card-img-overlay"></div>
        <span class="project-card-badge">${p.category}</span>
        <div class="project-card-hover">
          <a href="${p.live}" title="Live Demo" target="_blank">🔗</a>
          <a href="${p.github}" title="GitHub" target="_blank">⚡</a>
          <a href="project-detail.html?id=${p.id}" title="View Details" data-transition>👁</a>
        </div>
      </div>
      <div class="project-card-body">
        <div class="project-card-category">${p.category}</div>
        <h3 class="project-card-title">${p.title}</h3>
        <p class="project-card-desc">${p.desc}</p>
        <div class="project-card-tags">${tagHtml}</div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Re-observe new cards
  document.querySelectorAll('.project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    setTimeout(() => {
      el.style.transition = `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${parseFloat(el.style.transitionDelay || 0)}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${parseFloat(el.style.transitionDelay || 0)}s`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 50);

    // Re-attach tilt
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -16;
      el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateZ(8px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });

    // Intercept detail link
    el.querySelector('a[data-transition]')?.addEventListener('click', e => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href');
      if (window.navigateTo) window.navigateTo(href);
      else window.location.href = href;
    });
  });
}

// ─── Filter buttons ───────────────────────────────────────────────────────────
(function initFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.filter);
    });
  });

  renderProjects('All');
})();
