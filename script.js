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

/* --- 1. SIMULATION LOGIC (FIXED: API CALL RESTORED) --- */
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
    
    // UI State: Running
    runBtn.disabled = true;
    runBtn.innerHTML = '<i data-lucide="loader" class="spin"></i> Processing...';
    consoleOut.innerHTML = '';
    
    // Reset visuals
    document.querySelectorAll('.node, .connector').forEach(el => el.classList.remove('active'));

    await typeLog('System initialized.', 'text-muted');
    await wait(300);

    // --- STEP 1: TRIGGER ---
    document.getElementById('node-1').classList.add('active');
    await typeLog('Webhook received. Parsing payload...', 'processing');
    
    // --- RESTORED API CALL START ---
    // This sends the actual email via your backend
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      problem: document.getElementById('problem').value
    };

    try {
       fetch('/api/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(err => console.error("Silent API Fail:", err)); // Catch but don't stop demo
    } catch (err) {
      console.log("Simulating offline mode");
    }
    // --- RESTORED API CALL END ---

    await wait(800);

    // Flow Animation
    document.getElementById('conn-1').classList.add('active');
    await wait(1000);

    // --- STEP 2: AI AGENT ---
    document.getElementById('node-2').classList.add('active');
    await typeLog('AI analyzing request context...', 'processing');
    await wait(1200);
    await typeLog('Intent detected: Request. Confidence: 99%.');

    document.getElementById('conn-2').classList.add('active');
    await wait(1000);

    // --- STEP 3: DATABASE ---
    document.getElementById('node-3').classList.add('active');
    await typeLog('Querying Google Sheets...', 'processing');
    await wait(800);
    await typeLog('Data retrieved successfully.');

    document.getElementById('conn-3').classList.add('active');
    await wait(1000);

    // --- STEP 4: GMAIL ACTION ---
    document.getElementById('node-4').classList.add('active');
    await typeLog('Drafting response via Gmail...', 'processing');
    await wait(800);
    await typeLog('Email sent successfully. Workflow closed.', 'success');

    // UI State: Done
    runBtn.innerHTML = '<i data-lucide="check"></i> Done';
    runBtn.style.background = '#22c55e';
    
    setTimeout(() => {
      runBtn.disabled = false;
      runBtn.innerHTML = '<i data-lucide="play"></i> Run Workflow';
      runBtn.style.background = '';
      if (window.lucide) lucide.createIcons();
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
    if (sim) {
      // Improved scrolling centering
      const yOffset = -100; 
      const y = sim.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
    
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
  
  const genericDesc = "Custom n8n workflow engineered for autonomous operation.";

  try {
    const response = await fetch('/api/projects');
    let images = await response.json();

    if (!Array.isArray(images) || images.length === 0) {
      // Silent fallback so the section isn't empty
      images = ['personal-ai-agent.png', 'lead-gen-system.png']; 
    }

    grid.innerHTML = '';

    images.forEach((file, index) => {
      const delay = index * 100;
      const src = `/projects/${file}`;
      
      let rawTitle = file.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      const title = rawTitle.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
      const safeTitle = title.replace(/'/g, "\\'");

      grid.innerHTML += `
        <article 
          class="project-card reveal tilt-card" 
          style="animation-delay:${delay}ms"
          onclick="openLightbox('${src}', '${safeTitle}')"
        >
          <div class="project-thumb">
            <img src="${src}" alt="${title}" loading="lazy" onerror="this.parentElement.style.display='none'">
            <div class="thumb-overlay">
              <i data-lucide="zoom-in"></i>
            </div>
          </div>
          <div class="project-meta">
            <h3>${title}</h3>
            <p class="project-desc">${genericDesc}</p>
            <div class="project-footer">
              <span class="tech-badge">n8n</span>
              <span class="tech-badge">AI</span>
            </div>
          </div>
        </article>
      `;
    });

    setTimeout(() => {
      if (window.lucide) lucide.createIcons();
      initTilt(); 
    }, 100);

  } catch (error) {
    console.error('Loader failed:', error);
    grid.innerHTML = `<div class="console"><div class="console-body"><div class="log-line text-muted">Archives offline.</div></div></div>`;
  }
}

/* --- 4. LIGHTBOX --- */
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
  document.body.style.overflow = 'auto';
};

/* --- 5. STANDARD UI FUNCS --- */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (!dot || !outline || window.innerWidth < 768) return;
  
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    dot.style.left = `${posX}px`; 
    dot.style.top = `${posY}px`;
    
    // Using simple style setting instead of animate for better performance
    outline.style.left = `${posX}px`;
    outline.style.top = `${posY}px`;
  });

  document.querySelectorAll('a, button, .tilt-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top;
      card.style.transform = `perspective(1000px) rotateX(${-1 * ((y - rect.height / 2) / 30)}deg) rotateY(${(x - rect.width / 2) / 30}deg)`;
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
  
  const particles = Array.from({length: 50}, () => ({
    x: Math.random()*width, y: Math.random()*height,
    vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3
  }));

  function animate() {
    ctx.clearRect(0,0,width,height);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > width) p.vx *= -1; if(p.y < 0 || p.y > height) p.vy *= -1;
      
      ctx.fillStyle = '#ff6b00'; ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI*2); ctx.fill();
      
      for(let j=i+1; j<particles.length; j++) {
        const d = Math.hypot(p.x-particles[j].x, p.y-particles[j].y);
        if(d < 120) {
          ctx.strokeStyle = `rgba(255,107,0,${1 - d/120})`; ctx.lineWidth = 0.4;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
        }
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
}
