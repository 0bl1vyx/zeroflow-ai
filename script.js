document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }

  initScrollReveal();
  initCursor();
  initTilt();
  loadProjects();
  initNetworkBackground();
  initHeroSimulationShortcut();
  initScrollProgress();
});

/* --- 0. SCROLL PROGRESS --- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if(!bar) return;
  
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percent = (scrollTop / scrollHeight) * 100;
    bar.style.width = percent + "%";
  });
}

/* --- 1. CUSTOM CURSOR --- */
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

/* --- 2. 3D TILT EFFECT --- */
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

/* --- 3. PROJECT LOADER (Archives) --- */
async function loadProjects() {
  const grid = document.getElementById('project-grid');
  if (!grid) return;

  const fallbackProjects = [
    { file: 'personal-ai-agent.png', title: 'Inbox Copilot', tag: 'Gmail + Notion' },
    { file: 'lead-gen-system.png', title: 'Outreach System', tag: 'LinkedIn + Sheets' },
    { file: 'ops-dashboard.jpg', title: 'Ops Dashboard', tag: 'Internal Tools' }
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
        tag: 'Workflow Schematic'
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
              A blueprint of how the data flows between apps automatically.
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
        <div class="console-body">
          <div class="log-line text-muted">Unable to load project images.</div>
        </div>
      </div>
    `;
  }
}

/* --- 4. MOBILE MENU --- */
window.toggleMobileMenu = () => {
  const nav = document.getElementById('mobile-nav');
  if (!nav) return;
  nav.classList.toggle('active');
};

/* --- 5. SCROLL REVEAL --- */
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

/* --- 6. LIGHTBOX --- */
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

/* --- 7. SIMULATOR LOGIC (Updated for clarity) --- */
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
    runBtn.innerHTML = 'Running Demo...';
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }

    consoleOut.innerHTML = '';
    document.querySelectorAll('.node, .connector').forEach((el) => el.classList.remove('active'));

    await typeLog('Simulation started.', 'text-muted');
    await wait(300);

    const node1 = document.getElementById('node-1');
    const node2 = document.getElementById('node-2');
    const node3 = document.getElementById('node-3');
    const node4 = document.getElementById('node-4');
    const conn1 = document.getElementById('conn-1');
    const conn2 = document.getElementById('conn-2');
    const conn3 = document.getElementById('conn-3');

    if (node1) node1.classList.add('active');
    await typeLog('New request received from form.', 'processing');
    await wait(800);

    if (conn1) conn1.classList.add('active'); 
    await wait(1500); 

    if (node2) node2.classList.add('active');
    await typeLog('AI is reading the problem...', 'processing');
    await wait(1500);

    await typeLog('AI understood the task. Confidence: 99%.');
    if (conn2) conn2.classList.add('active');
    await wait(1500);

    if (node3) node3.classList.add('active');
    await typeLog('Connecting to Google Sheets & Email...', 'processing');

    try {
      const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        problem: document.getElementById('problem').value
      };
      // Fire and forget
      fetch('/api/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error('Trigger API error:', err);
    }

    await wait(1500);
    if (conn3) conn3.classList.add('active');
    
    await wait(1500);
    if (node4) node4.classList.add('active');
    await typeLog('Draft reply sent to your email. Done.', 'success');

    runBtn.innerHTML = 'Finished';
    runBtn.style.background = '#22c55e';

    setTimeout(() => {
      runBtn.disabled = false;
      runBtn.innerHTML = '<i data-lucide="play"></i> Run Simulation';
      runBtn.style.background = '';
      if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
      }
    }, 5000);
  });
}

/* --- 8. HERO → SIM SHORTCUT --- */
function initHeroSimulationShortcut() {
  const heroBtn = document.getElementById('hero-sim-btn');
  const form = document.getElementById('agentForm');
  if (!heroBtn || !form) return;

  heroBtn.addEventListener('click', () => {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const problem = document.getElementById('problem');

    if (name) name.value = 'E-com Store Owner';
    if (email) email.value = 'owner@myshop.com';
    if (problem) {
      problem.value =
        'I waste 2 hours a day copying tracking numbers from Shopify to emails.';
    }

    const sim = document.getElementById('simulator');
    if (sim) sim.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      form.requestSubmit();
    }, 800);
  });
}

/* --- 9. REACTIVE NETWORK BACKGROUND --- */
function initNetworkBackground() {
  const canvas = document.getElementById('neuro-network');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
  });

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();

  let particles = [];
  const particleCount = 80;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 30) + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density;
          const directionY = forceDirectionY * force * this.density;
          
          this.x -= directionX;
          this.y -= directionY;
      }
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

/* --- 10. TERMINAL WIDGET --- */
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
      if (txt.toLowerCase() === 'clear') {
          body.innerHTML = '<div>$ status --check</div><div>[OK] Online.</div>';
      } else if (txt.toLowerCase() === 'help') {
          body.innerHTML += `<div>Available commands: status, clear, hire</div>`;
      } else {
          body.innerHTML += `<div>Thinking...</div>`;
          body.innerHTML += `<div>(This is just a demo terminal. Use the form to contact me!)</div>`;
      }
      body.scrollTop = body.scrollHeight;
    }, 600);
  });
}
