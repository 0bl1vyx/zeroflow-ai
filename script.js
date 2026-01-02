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
  initSimulationLogic();
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

/* --- 1. SIMULATION LOGIC (Clean Style) --- */
function initSimulationLogic() {
  const form = document.getElementById('agentForm');
  const runBtn = document.getElementById('runBtn');
  const consoleOut = document.getElementById('console-output');

  if (!form || !runBtn || !consoleOut) return;

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
  async function typeLog(message, type = '') {
    const time = new Date().toLocaleTimeString([], { hour12: false });
    const fullLine = `[${time}] ${message}`;
    const lineDiv = document.createElement('div');
    lineDiv.className = `log-line ${type}`;
    consoleOut.appendChild(lineDiv);
    consoleOut.scrollTop = consoleOut.scrollHeight;
    await wait(20);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    runBtn.disabled = true;
    runBtn.innerHTML = '<i data-lucide="loader" class="spin"></i> Processing...';
    consoleOut.innerHTML = '';
    
    // Clear old state
    document.querySelectorAll('.node, .connector').forEach(el => el.classList.remove('active'));

    await typeLog('System initialized.', 'text-muted');
    await wait(300);

    // 1. Trigger
    document.getElementById('node-1').classList.add('active');
    await typeLog('Webhook received. Parsing payload...', 'processing');
    await wait(800);

    // Flow
    document.getElementById('conn-1').classList.add('active');
    await wait(1000);

    // 2. AI
    document.getElementById('node-2').classList.add('active');
    await typeLog('AI analyzing request context...', 'processing');
    await wait(1200);
    await typeLog('Intent detected: Order Inquiry. Confidence: 99%.');

    document.getElementById('conn-2').classList.add('active');
    await wait(1000);

    // 3. Database
    document.getElementById('node-3').classList.add('active');
    await typeLog('Querying Google Sheets for Order #...', 'processing');
    await wait(800);
    await typeLog('Data retrieved successfully.');

    document.getElementById('conn-3').classList.add('active');
    await wait(1000);

    // 4. Gmail
    document.getElementById('node-4').classList.add('active');
    await typeLog('Drafting response via Gmail...', 'processing');
    await wait(800);
    await typeLog('Email sent successfully. Workflow closed.', 'success');

    runBtn.innerHTML = '<i data-lucide="check"></i> Done';
    runBtn.style.background = '#22c55e';
    
    setTimeout(() => {
      runBtn.disabled = false;
      runBtn.innerHTML = '<i data-lucide="play"></i> Run Workflow';
      runBtn.style.background = '';
    }, 4000);

    if (window.lucide) lucide.createIcons();
  });
}

/* --- 2. HERO SHORTCUT --- */
function initHeroSimulationShortcut() {
  const heroBtn = document.getElementById('hero-sim-btn');
  if (!heroBtn) return;
  heroBtn.addEventListener('click', () => {
    const sim = document.getElementById('simulator');
    if (sim) sim.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const nameInput = document.getElementById('name');
      if(nameInput) nameInput.focus();
    }, 800);
  });
}

/* --- 3. PROJECT LOADER --- */
async function loadProjects() {
  const grid = document.getElementById('project-grid');
  if (!grid) return;
  const projects = [
    { file: 'personal-ai-agent.png', title: 'Inbox Copilot', tag: 'Gmail + Notion' },
    { file: 'lead-gen-system.png', title: 'Outreach System', tag: 'LinkedIn + Sheets' }
  ];
  grid.innerHTML = '';
  projects.forEach((item, index) => {
    const delay = index * 100;
    grid.innerHTML += `
      <article class="project-card reveal tilt-card" style="animation-delay:${delay}ms">
        <div class="project-thumb"><img src="/projects/${item.file}" alt="${item.title}" onerror="this.style.display='none'"></div>
        <div class="project-meta">
          <span class="project-tag">${item.tag}</span>
          <h3>${item.title}</h3>
        </div>
      </article>
    `;
  });
}

/* --- 4. STANDARD UI FUNCS --- */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (!dot || !outline || window.innerWidth < 768) return;
  window.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`; dot.style.top = `${e.clientY}px`;
    outline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: 'forwards' });
  });
  document.querySelectorAll('a, button, .tilt-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      card.style.transform = `perspective(1000px) rotateX(${-1 * ((y - rect.height / 2) / 20)}deg) rotateY(${(x - rect.width / 2) / 20}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)');
  });
}

function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('active'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

window.toggleMobileMenu = () => {
  const nav = document.getElementById('mobile-nav');
  if(nav) nav.classList.toggle('active');
};

function initNetworkBackground() {
  const canvas = document.getElementById('neuro-network');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  function resize() { width = window.innerWidth; height = window.innerHeight; canvas.width = width; canvas.height = height; }
  window.addEventListener('resize', resize); resize();
  
  const particles = Array.from({length: 60}, () => ({
    x: Math.random()*width, y: Math.random()*height,
    vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5
  }));

  function animate() {
    ctx.clearRect(0,0,width,height);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > width) p.vx *= -1; if(p.y < 0 || p.y > height) p.vy *= -1;
      ctx.fillStyle = '#ff6b00'; ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI*2); ctx.fill();
      for(let j=i+1; j<particles.length; j++) {
        const d = Math.hypot(p.x-particles[j].x, p.y-particles[j].y);
        if(d < 150) {
          ctx.strokeStyle = `rgba(255,107,0,${1 - d/150})`; ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
        }
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
}
