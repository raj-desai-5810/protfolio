/* =============================================
   SKILLS.JS
   ============================================= */

'use strict';

// ─── Skills data ─────────────────────────────────────────────────────────────
const SKILLS = {
  Frontend: [
    { name: 'HTML5 / CSS3',  pct: 96, color: 'coral'  },
    { name: 'JavaScript ES6+', pct: 92, color: ''      },
    { name: 'React.js',       pct: 90, color: 'cyan'  },
    { name: 'Vue.js',         pct: 82, color: 'green' },
    { name: 'Next.js',        pct: 85, color: ''      },
    { name: 'TypeScript',     pct: 80, color: 'cyan'  },
    { name: 'Tailwind CSS',   pct: 88, color: 'coral' },
    { name: 'Three.js',       pct: 70, color: 'green' },
  ],
  Backend: [
    { name: 'Node.js',        pct: 88, color: 'green' },
    { name: 'Express.js',     pct: 85, color: ''      },
    { name: 'Python',         pct: 78, color: 'cyan'  },
    { name: 'Django',         pct: 72, color: 'green' },
    { name: 'GraphQL',        pct: 75, color: 'coral' },
    { name: 'REST APIs',      pct: 92, color: ''      },
  ],
  Frameworks: [
    { name: 'React Native',   pct: 76, color: 'cyan'  },
    { name: 'Electron',       pct: 68, color: ''      },
    { name: 'Flask',          pct: 74, color: 'coral' },
    { name: 'Socket.io',      pct: 80, color: 'green' },
    { name: 'Redux',          pct: 82, color: ''      },
    { name: 'Zustand',        pct: 78, color: 'cyan'  },
  ],
  Databases: [
    { name: 'MongoDB',        pct: 86, color: 'green' },
    { name: 'PostgreSQL',     pct: 80, color: 'cyan'  },
    { name: 'MySQL',          pct: 78, color: 'coral' },
    { name: 'Redis',          pct: 74, color: ''      },
    { name: 'Firebase',       pct: 82, color: 'coral' },
  ],
  Tools: [
    { name: 'Git / GitHub',   pct: 94, color: 'coral' },
    { name: 'Docker',         pct: 76, color: 'cyan'  },
    { name: 'Webpack / Vite', pct: 80, color: ''      },
    { name: 'Figma',          pct: 72, color: 'green' },
    { name: 'AWS',            pct: 68, color: 'cyan'  },
    { name: 'Linux / Bash',   pct: 74, color: ''      },
  ],
};

// Circumference for r=29 circle: 2π×29 ≈ 182.2
const CIRC = 2 * Math.PI * 29;

function buildSkillCard(skill) {
  const offset = CIRC * (1 - skill.pct / 100);
  return `
    <div class="skill-card reveal">
      <div class="skill-radial ${skill.color}" data-pct="${skill.pct}">
        <svg viewBox="0 0 64 64">
          <circle class="skill-radial-bg" cx="32" cy="32" r="29"/>
          <circle class="skill-radial-fill"
            cx="32" cy="32" r="29"
            style="stroke-dashoffset:${CIRC}"
            data-offset="${offset}"/>
        </svg>
        <span class="skill-radial-pct">${skill.pct}%</span>
      </div>
      <div class="skill-info">
        <div class="skill-name">${skill.name}</div>
        <div class="skill-level">${skill.pct >= 90 ? 'Expert' : skill.pct >= 80 ? 'Advanced' : skill.pct >= 70 ? 'Proficient' : 'Intermediate'}</div>
      </div>
    </div>`;
}

// ─── Render skill panels ──────────────────────────────────────────────────────
function renderPanel(category) {
  const panel = document.querySelector(`.skills-panel[data-cat="${category}"]`);
  if (!panel) return;
  panel.innerHTML = SKILLS[category].map(buildSkillCard).join('');
  observeRadials(panel);
  observeReveals(panel);
}

// ─── Animate radial rings on scroll ──────────────────────────────────────────
function observeRadials(container) {
  const circles = container.querySelectorAll('.skill-radial-fill');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const circle = entry.target;
        const targetOffset = parseFloat(circle.dataset.offset);
        requestAnimationFrame(() => {
          circle.style.strokeDashoffset = targetOffset;
        });
        obs.unobserve(circle);
      }
    });
  }, { threshold: 0.4 });
  circles.forEach(c => obs.observe(c));
}

// ─── Re-observe scroll reveals in panel ──────────────────────────────────────
function observeReveals(container) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  container.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ─── Tab switching ────────────────────────────────────────────────────────────
(function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.skills-panel');
  if (!tabs.length) return;

  // Pre-render all panels
  Object.keys(SKILLS).forEach(cat => renderPanel(cat));

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      const panel = document.querySelector(`.skills-panel[data-cat="${cat}"]`);
      if (panel) panel.classList.add('active');
    });
  });

  // Activate first tab
  tabs[0]?.click();
})();

// ─── Proficiency bars ─────────────────────────────────────────────────────────
(function initProfBars() {
  const bars = document.querySelectorAll('.prof-bar-fill');
  if (!bars.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const pct = bar.dataset.pct;
        bar.style.width = pct + '%';
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => obs.observe(b));
})();

// ─── Tech cloud float animation ───────────────────────────────────────────────
(function floatChips() {
  const chips = document.querySelectorAll('.tech-chip');
  chips.forEach((chip, i) => {
    chip.style.animationDelay = `${i * 0.15}s`;
    chip.style.animation = `chipFloat ${2.5 + (i % 3) * 0.5}s ease-in-out ${i * 0.1}s infinite alternate`;
  });
  const style = document.createElement('style');
  style.textContent = `
    @keyframes chipFloat {
      from { transform: translateY(0px); }
      to   { transform: translateY(-8px); }
    }
  `;
  document.head.appendChild(style);
})();
