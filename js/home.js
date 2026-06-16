/* =============================================
   HOME.JS — Three.js scroll-driven scene + parallax
   ============================================= */

'use strict';

// ─── Three.js Scene Setup ─────────────────────────────────────────────────────
(function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, canvas.offsetWidth / canvas.offsetHeight, 0.1, 200);
  camera.position.set(0, 0, 6);

  // ── Lighting ──
  const ambientLight = new THREE.AmbientLight(0x6C63FF, 0.6);
  scene.add(ambientLight);
  const pointLight1 = new THREE.PointLight(0x6C63FF, 2, 30);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);
  const pointLight2 = new THREE.PointLight(0x00D4FF, 1.5, 30);
  pointLight2.position.set(-5, -3, 3);
  scene.add(pointLight2);

  // ── Particle System (scroll-driven tunnel) ──
  const PARTICLE_COUNT = 1800;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);
  const sizes     = new Float32Array(PARTICLE_COUNT);

  const c1 = new THREE.Color(0x6C63FF);
  const c2 = new THREE.Color(0x00D4FF);
  const c3 = new THREE.Color(0xFF6B6B);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle  = Math.random() * Math.PI * 2;
    const radius = 1.5 + Math.random() * 4;
    const depth  = (Math.random() - 0.5) * 80;

    positions[i * 3]     = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = depth;

    const mix = Math.random();
    const col = mix < 0.5 ? c1.clone().lerp(c2, mix * 2)
                           : c2.clone().lerp(c3, (mix - 0.5) * 2);
    colors[i * 3]     = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
    sizes[i] = 0.5 + Math.random() * 2.5;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  pGeo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  const pMat = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ── Wireframe Geometries ──
  const objects = [];
  const geoDefs = [
    { geo: new THREE.IcosahedronGeometry(0.7, 1), pos: [2.5, 1.2, -1]   },
    { geo: new THREE.OctahedronGeometry(0.5, 0),  pos: [-2.8, -0.8, -2] },
    { geo: new THREE.TorusGeometry(0.55, 0.18, 12, 32), pos: [0.5, -1.8, -0.5] },
    { geo: new THREE.TetrahedronGeometry(0.6, 0), pos: [-1.5, 1.5, -1.5] },
    { geo: new THREE.BoxGeometry(0.7, 0.7, 0.7),  pos: [3.2, -1.5, -3]  },
  ];

  geoDefs.forEach(({ geo, pos }, i) => {
    const mat = new THREE.MeshBasicMaterial({
      color: [0x6C63FF, 0x00D4FF, 0xFF6B6B, 0x00FFB3, 0x9D4EDD][i % 5],
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    mesh.userData = { basePos: [...pos], rotSpeed: (Math.random() - 0.5) * 0.008 };
    scene.add(mesh);
    objects.push(mesh);
  });

  // ── Mouse interaction ──
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Scroll-driven tunnel effect ──
  let scrollProgress = 0;
  let targetScrollProgress = 0;
  const hero = document.getElementById('hero');

  window.addEventListener('scroll', () => {
    if (!hero) return;
    const heroH = hero.offsetHeight;
    const raw = window.scrollY / heroH;
    targetScrollProgress = Math.min(Math.max(raw, 0), 1);
  }, { passive: true });

  // ── Clock & render loop ──
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Smooth lerp
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.07;
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Drive camera Z through tunnel on scroll
    camera.position.z = 6 - scrollProgress * 16;
    camera.position.x = targetX * 1.5;
    camera.position.y = -targetY * 1.0;
    camera.lookAt(0, 0, camera.position.z - 5);

    // Rotate particle tunnel
    particles.rotation.z = elapsed * 0.04 + scrollProgress * Math.PI * 0.5;

    // Animate floating objects
    objects.forEach((obj, i) => {
      obj.rotation.x += obj.userData.rotSpeed;
      obj.rotation.y += obj.userData.rotSpeed * 0.7;
      const bp = obj.userData.basePos;
      obj.position.y = bp[1] + Math.sin(elapsed * 0.6 + i) * 0.15;
      obj.position.x = bp[0] + targetX * 0.3;
    });

    renderer.render(scene, camera);
  }

  animate();

  // ── Resize handler ──
  const resizeObserver = new ResizeObserver(() => {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  resizeObserver.observe(canvas.parentElement);
})();

// ─── Hero text entrance animation ─────────────────────────────────────────────
(function heroEntrance() {
  const badge   = document.querySelector('.hero-badge');
  const name    = document.querySelector('.hero-name');
  const title   = document.querySelector('.hero-title');
  const desc    = document.querySelector('.hero-desc');
  const cta     = document.querySelector('.hero-cta');
  const scroll  = document.querySelector('.scroll-indicator');

  const els = [badge, name, title, desc, cta, scroll].filter(Boolean);

  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.12}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.12}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 50);
  });
})();

// ─── Typewriter effect ────────────────────────────────────────────────────────
(function typewriter() {
  const el = document.querySelector('.hero-type');
  if (!el) return;

  const words = ['Full-Stack Developer', 'UI/UX Engineer', 'Problem Solver', 'Tech Enthusiast'];
  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseTimer = null;

  function type() {
    const current = words[wordIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        pauseTimer = setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? 50 : 90);
  }

  setTimeout(type, 1200);
})();

// ─── Featured Projects hover 3D tilt ─────────────────────────────────────────
// (Handled by global.js data-tilt — no extra code needed here)

// ─── Stats counter on scroll ─────────────────────────────────────────────────
// (Handled by global.js data-counter)
