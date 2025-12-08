document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }

  initScrollReveal();
  initCursor();
  initTilt();
  typeWriterEffect();
  loadProjects();
  initNetworkBackground();
  initHeroSimulationShortcut();
});

/* --- 1. TYPING EFFECT (Hero) --- */

function typeWriterEffect() {
  const el = document.querySelector('.type-effect');
  if (!el) return;
  const text = el.getAttribute('data-text') || '';
  let i = 0;

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 100);
    }
  }

  setTimeout(type, 400);
}

/* --- 2. CUSTOM CURSOR --- */

function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (!dot || !outline) return;
  if (window.innerWidth < 768) return;

  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;

    outline.animate(
      { left: `${posX}px`, top: `${posY}px` },
      { duration: 500, fill: 'forwards' }
    );
  });

  const clickables = document.querySelectorAll(
    'a, button, .project-card, .price-card, .terminal-header, .tpl-card, .host-card, .persona-card'
  );

  clickables.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

/* --- 3. 3D TILT EFFECT --- */

function initTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xRot = -1 * ((y - rect.height / 2) / 20);
      const yRot = (x - rect.width / 2) / 20;
      card.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });
}

/* --- 4. PROJECT LOADER (Archives) --- */

async function loadProjects() {
  const grid = document.getElementById('project-grid');
  if (!grid) return;

  const fallbackProjects = [
    { file: 'personal-ai-agent.png', title: 'Founder Inbox Copilot', tag: 'AI Agent · Gmail + Notion' },
    { file: 'lead-gen-system.png', title: 'Cold Outreach Sequencer', tag: 'n8n · LinkedIn + Sheets' },
    { file: 'ops-dashboard.jpg', title: 'Ops Command Dashboard', tag: 'RAG · Internal Docs' }
  ];

  try {
    const response = await fetch('/api/projects');
    let images = await response.json();

    if (!Array.isArray(images) || images.length === 0) {
      images = fallbackProjects;
    } else {
      images = images.map((file) => ({
        file,
        title: file.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        tag: 'Automation Schematic'
      }));
    }

    grid.innerHTML = '';

    images.forEach((item, index) => {
      const delay = index * 80;
      const src = `/projects/${item.file}`;
      const safeTitle = (item.title || '').replace(/'/g, "\\'");

      grid.innerHTML += `
        <article
          class="project-card reveal tilt-card"
          style="animation-delay:${delay}ms"
          onclick="openLightbox('${src}', '${safeTitle}')"
        >
          <div class="project-thumb">
            <img src="${src}" alt="${item.title}">
          </div>
          <div class="project-meta">
            <span class="project-tag">${item.tag}</span>
            <h3>${item.title}</h3>
            <p class="project-desc">
              Visual workflow map showing triggers, AI nodes, and downstream systems.
            </p>
          </div>
        </article>
      `;
    });

    setTimeout(() => {
      if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
      }
      initScrollReveal();
      initTilt();
    }, 100);
  } catch (error) {
    console.error('Loader failed:', error);
    grid.innerHTML = `
      <div class="console">
        <div class="console-header">
          <span>archives@zeroflow</span>
          <span class="status-dot"></span>
        </div>
        <div class="console-body">
          <div class="log-line text-muted">Unable to access automation archives API.</div>
          <div class="log-line">Request a live walkthrough instead.</div>
        </div>
      </div>
    `;
  }
}

/* --- 5. MOBILE MENU --- */

window.toggleMobileMenu = () => {
  const nav = document.getElementById('mobile-nav');
  if (!nav) return;
  nav.classList.toggle('active');
};

/* --- 6. SCROLL REVEAL --- */

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* --- 7. LIGHTBOX --- */

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

window.openLightbox = (src, title) => {
  if (!lightbox || !lightboxImg) return;
  lightbox.style.display = 'flex';
  lightboxImg.src = src;
  if (lightboxCaption) lightboxCaption.textContent = title || '';
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = () => {
  if (!lightbox || !lightboxImg) return;
  lightbox.style.display = 'none';
  lightboxImg.src = '';
  if (lightboxCaption) lightboxCaption.textContent = '';
  document.body.style.overflow = 'auto';
};

/* --- 8. SIMULATOR LOGIC --- */

const demoForm = document.getElementById('agentForm');
const runBtn = document.getElementById('runBtn');
const consoleOut = document.getElementById('console-output');

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function typeLog(message, type = '') {
  if (!consoleOut) return;
  const time = new Date().toLocaleTimeString([], { hour12: false });
  const fullLine = `[${time}] ${message}`;
  const lineDiv = document.createElement('div');
  lineDiv.className = `log-line ${type}`;
  consoleOut.appendChild(lineDiv);

  for (let i = 0; i < fullLine.length; i++) {
    lineDiv.textContent += fullLine.charAt(i);
    consoleOut.scrollTop = consoleOut.scrollHeight;
    await wait(10);
  }
}

if (demoForm && runBtn && consoleOut) {
  demoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    runBtn.disabled = true;
    runBtn.innerHTML = 'Initializing...';
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }

    consoleOut.innerHTML = '';
    document.querySelectorAll('.node, .connector').forEach((el) => el.classList.remove('active'));

    await typeLog('System initialized.', 'text-muted');
    await wait(300);

    const node1 = document.getElementById('node-1');
    const node2 = document.getElementById('node-2');
    const node3 = document.getElementById('node-3');
    const node4 = document.getElementById('node-4');
    const conn1 = document.getElementById('conn-1');
    const conn2 = document.getElementById('conn-2');
    const conn3 = document.getElementById('conn-3');

    if (node1) node1.classList.add('active');
    await typeLog('Webhook triggered: inbound payload received.', 'processing');
    await wait(800);

    if (conn1) conn1.classList.add('active');
    await wait(800);

    if (node2) node2.classList.add('active');
    await typeLog('AI agent analyzing request context…', 'processing');
    await wait(1500);

    await typeLog('Reasoning complete. Confidence: 98%.');
    if (conn2) conn2.classList.add('active');
    await wait(800);

    if (node3) node3.classList.add('active');
    await typeLog('Executing functions: Google Sheets, CRM.', 'processing');

    // Fire & forget API call
    try {
      const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        problem: document.getElementById('problem').value
      };

      fetch('/api/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error('Trigger API error:', err);
    }

    await wait(1200);
    if (conn3) conn3.classList.add('active');
    if (node4) node4.classList.add('active');
    await typeLog('Report dispatched via Gmail. Task closed.', 'success');

    runBtn.innerHTML = 'Complete';
    runBtn.style.background = '#22c55e';

    setTimeout(() => {
      runBtn.disabled = false;
      runBtn.innerHTML = '<i data-lucide="cpu"></i> Run Simulation';
      runBtn.style.background = '';
      if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
      }
    }, 5000);
  });
}

/* --- 9. HERO → SIM SHORTCUT --- */

function initHeroSimulationShortcut() {
  const heroBtn = document.getElementById('hero-sim-btn');
  const form = document.getElementById('agentForm');
  if (!heroBtn || !form) return;

  heroBtn.addEventListener('click', () => {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const problem = document.getElementById('problem');

    if (name) name.value = 'E-com Founder';
    if (email) email.value = 'founder@example.com';
    if (problem) {
      problem.value =
        'We waste 2–3 hours/day replying to repetitive order status emails and updating a Google Sheet manually.';
    }

    const sim = document.getElementById('simulator');
    if (sim) sim.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      form.requestSubmit();
    }, 800);
  });
}

/* --- 10. NETWORK BACKGROUND --- */

function initNetworkBackground() {
  const canvas = document.getElementById('neuro-network');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();

  let particles = [];
  const particleCount = 60;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.fillStyle = '#ff6b00';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, idx) => {
      p.update();
      p.draw();

      for (let j = idx + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.strokeStyle = `rgba(255, 107, 0, ${1 - dist / 150})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', resize);
}

/* --- 11. TERMINAL WIDGET --- */

window.toggleTerminal = () => {
  const widget = document.getElementById('terminal-widget');
  if (!widget) return;
  widget.classList.toggle('open');
};

const termInput = document.getElementById('term-input');

if (termInput) {
  termInput.addEventListener('keypress', function (e) {
    if (e.key !== 'Enter') return;
    const txt = this.value.trim();
    if (!txt) return;

    const body = document.getElementById('terminal-body');
    if (!body) return;

    body.innerHTML += `<div>$ ${txt}</div>`;
    this.value = '';
    body.scrollTop = body.scrollHeight;

    setTimeout(() => {
      body.innerHTML += `<div>Processing request: "${txt}"…</div>`;
      body.innerHTML += `<div>Please use the form above for official inquiries.</div>`;
      body.scrollTop = body.scrollHeight;
    }, 1000);
  });
}
