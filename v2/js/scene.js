/**
 * scene.js — Global 3D Background System
 * Uses Three.js to render abstract geometric forms
 * synchronized with scroll and cursor movement.
 */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  /* ─── CONFIG ─── */
  const CONFIG = {
    particleCount: 120,
    geometryCount: 7,
    mouseInfluence: 0.0006,
    scrollInfluence: 0.0012,
    baseRotationSpeed: 0.0006,
    fogNear: 20,
    fogFar: 80,
    cameraZ: 30,
    color: 0x1a1a1a,
  };

  /* ─── SETUP ─── */
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf8f9fa, CONFIG.fogNear, CONFIG.fogFar);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(0, 0, CONFIG.cameraZ);

  /* ─── LIGHTS ─── */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.3, 60);
  pointLight.position.set(-10, -10, 10);
  scene.add(pointLight);

  /* ─── MATERIALS ─── */
  const wireframeMat = new THREE.MeshBasicMaterial({
    color: CONFIG.color,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  });

  const solidMat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0x111111,
    shininess: 30,
    transparent: true,
    opacity: 0.06,
    side: THREE.DoubleSide,
  });

  const lineMat = new THREE.LineBasicMaterial({
    color: CONFIG.color,
    transparent: true,
    opacity: 0.12,
  });

  /* ─── GEOMETRIC OBJECTS ─── */
  const objects = [];

  function createObject(geometry, material, x, y, z, rx, ry, rz) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    scene.add(mesh);
    return mesh;
  }

  // Large icosahedron — left background
  objects.push({
    mesh: createObject(
      new THREE.IcosahedronGeometry(6, 1),
      wireframeMat.clone(),
      -14, 4, -8,
      0.4, 0.6, 0.2
    ),
    rotX: 0.0004, rotY: 0.0007, floatAmp: 0.8, floatSpeed: 0.4, phase: 0,
  });

  // Torus — right side
  objects.push({
    mesh: createObject(
      new THREE.TorusGeometry(5, 0.08, 8, 60),
      wireframeMat.clone(),
      13, -3, -6,
      1.2, 0.3, 0.5
    ),
    rotX: 0.0008, rotY: 0.0005, floatAmp: 1.0, floatSpeed: 0.35, phase: 1.5,
  });

  // Octahedron — top right
  objects.push({
    mesh: createObject(
      new THREE.OctahedronGeometry(4, 0),
      wireframeMat.clone(),
      10, 9, -12,
      0.2, 0.8, 0.1
    ),
    rotX: 0.0006, rotY: 0.0009, floatAmp: 1.2, floatSpeed: 0.55, phase: 2.1,
  });

  // Tetrahedron — bottom left
  objects.push({
    mesh: createObject(
      new THREE.TetrahedronGeometry(4.5, 0),
      wireframeMat.clone(),
      -12, -8, -10,
      0.6, 1.2, 0.4
    ),
    rotX: 0.0009, rotY: 0.0004, floatAmp: 0.9, floatSpeed: 0.45, phase: 0.8,
  });

  // Small sphere — centre
  objects.push({
    mesh: createObject(
      new THREE.SphereGeometry(2.5, 16, 16),
      solidMat.clone(),
      0, 0, -15,
      0, 0, 0
    ),
    rotX: 0.0003, rotY: 0.0008, floatAmp: 0.5, floatSpeed: 0.3, phase: 3.0,
  });

  // Torus knot — far back
  objects.push({
    mesh: createObject(
      new THREE.TorusKnotGeometry(3, 0.6, 80, 12, 2, 3),
      wireframeMat.clone(),
      5, -12, -18,
      0.3, 0.5, 0.7
    ),
    rotX: 0.0007, rotY: 0.001, floatAmp: 1.4, floatSpeed: 0.25, phase: 1.2,
  });

  // Box — upper left
  objects.push({
    mesh: createObject(
      new THREE.BoxGeometry(4, 4, 4),
      wireframeMat.clone(),
      -8, 12, -14,
      0.7, 0.4, 0.9
    ),
    rotX: 0.0005, rotY: 0.0006, floatAmp: 0.7, floatSpeed: 0.5, phase: 2.8,
  });

  /* ─── PARTICLE SYSTEM ─── */
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(CONFIG.particleCount * 3);
  const particleSpeeds = [];

  for (let i = 0; i < CONFIG.particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
    particleSpeeds.push(Math.random() * 0.003 + 0.001);
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: CONFIG.color,
    size: 0.08,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* ─── CONNECTING LINES ─── */
  function createLine(points) {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return new THREE.Line(geo, lineMat.clone());
  }

  // Architectural frame lines
  const frameLines = [];
  const framePositions = [
    [[-20, 15, -20], [20, 15, -20]],
    [[-20, -15, -20], [20, -15, -20]],
    [[-20, 15, -20], [-20, -15, -20]],
    [[20, 15, -20], [20, -15, -20]],
  ];

  framePositions.forEach(([a, b]) => {
    const line = createLine([
      new THREE.Vector3(...a),
      new THREE.Vector3(...b),
    ]);
    scene.add(line);
    frameLines.push(line);
  });

  /* ─── STATE ─── */
  let scrollY = 0;
  let targetScrollY = 0;
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let time = 0;
  let animFrameId;

  /* ─── EVENT LISTENERS ─── */
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', onResize);

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /* ─── ANIMATION LOOP ─── */
  function animate() {
    animFrameId = requestAnimationFrame(animate);
    time += 0.008;

    // Smooth mouse interpolation
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Smooth scroll interpolation
    scrollY += (targetScrollY - scrollY) * 0.06;

    // Camera subtle drift from mouse
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    // Scroll drives Z translation of entire scene group
    const scrollOffset = scrollY * CONFIG.scrollInfluence;

    // Animate each geometry
    objects.forEach((obj, i) => {
      obj.mesh.rotation.x += obj.rotX + mouseY * CONFIG.mouseInfluence;
      obj.mesh.rotation.y += obj.rotY + mouseX * CONFIG.mouseInfluence;

      // Float up/down
      const floatY = Math.sin(time * obj.floatSpeed + obj.phase) * obj.floatAmp;
      obj.mesh.position.y += (floatY * 0.01);

      // Scroll parallax per object (different depths)
      const depth = (i + 1) * 0.3;
      obj.mesh.position.z = obj.mesh.position.z + Math.sin(scrollOffset * depth) * 0.001;
    });

    // Particle rotation
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;

    // Frame lines pulse opacity
    frameLines.forEach((line, i) => {
      line.material.opacity = 0.06 + Math.sin(time * 0.5 + i) * 0.04;
    });

    renderer.render(scene, camera);
  }

  animate();

  /* ─── CLEANUP on page hide ─── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrameId);
    } else {
      animate();
    }
  });

})();
