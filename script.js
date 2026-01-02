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

/* --- 1. SIMULATION LOGIC (New n8n style) --- */
function initSimulationLogic() {
  const form = document.getElementById('agentForm');
  const runBtn = document.getElementById('runBtn');
  const jsonOut = document.getElementById('json-output');
  const statusBadge = document.getElementById('exec-status');
  const statusDot = document.querySelector('.status-dot');

  if (!form || !runBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // UI State: Running
    runBtn.disabled = true;
    runBtn.innerHTML = '<i data-lucide="loader" class="spin"></i> Executing...';
    if(statusBadge) {
      statusBadge.classList.add('running');
      statusBadge.innerHTML = '<i data-lucide="loader"></i> Running';
    }
    if(statusDot) statusDot.classList.add('active');
    
    // Clear nodes
    document.querySelectorAll('.n8n-node').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.n8n-conn').forEach(c => c.classList.remove('active'));
    
    // Initial Data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      request: document.getElementById('problem').value,
      timestamp: new Date().toISOString()
    };

    updateJson({ event: "webhook_received", payload: formData });
    
    // Step 1: Trigger
    await activateNode('node-1');
    await activateConn('conn-1');
    
    // Step 2: AI Processing
    updateJson({ 
      step: "ai_analysis", 
      status: "processing", 
      intent: "order_inquiry",
      sentiment: "neutral" 
    });
    await activateNode('node-2');
    await activateConn('conn-2');
    
    // Step 3: Database Lookup
    updateJson({ 
      step: "db_lookup", 
      query: "SELECT * FROM orders WHERE email = '" + formData.email + "'",
      found: true,
      order_id: "#8821" 
    });
    await activateNode('node-3');
    await activateConn('conn-3');
    
    // Step 4: Gmail
    updateJson({ 
      step: "send_email", 
      recipient: formData.email, 
      subject: "Re: Order #8821", 
      status: "sent" 
    });
    await activateNode('node-4');

    // Finish
    runBtn.innerHTML = '<i data-lucide="check"></i> Done';
    runBtn.style.background = '#22c55e';
    if(statusBadge) {
      statusBadge.classList.remove('running');
      statusBadge.innerHTML = '<i data-lucide="check-circle"></i> Success';
    }
    
    setTimeout(() => {
      runBtn.disabled = false;
      runBtn.innerHTML = '<i data-lucide="play"></i> Execute Workflow';
      runBtn.style.background = '';
    }, 4000);
    
    // Re-init icons for the new HTML injected
    if (window.lucide) lucide.createIcons();
  });

  function updateJson(data) {
    // Append nicely formatted JSON line
    const str = JSON.stringify(data, null, 2);
    jsonOut.textContent = str; // Replace content to show current state
  }

  async function activateNode(id) {
    document.getElementById(id).classList.add('active');
    await wait(800);
  }

  async function activateConn(id) {
    document.getElementById(id).classList.add('active');
    await wait(1000); // Time for the "dot" to travel
  }
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }


/* --- 2. CUSTOM CURSOR --- */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (!dot || !outline || window.innerWidth < 768) return;

  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;
    outline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: 'forwards' });
  });

  // Hover effects
  document.querySelectorAll('a, button, .n8n-node, .tilt-card').forEach((el) => {
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

/* --- 4. PROJECT LOADER --- */
async function loadProjects() {
  const grid = document.getElementById('project-grid');
  if (!grid) return;
  // Default fallbacks if API fails
  const projects = [
    { file: 'personal-ai-agent.png', title: 'Inbox Copilot', tag: 'Gmail + Notion' },
    { file: 'lead-gen-system.png', title: 'Outreach System', tag: 'LinkedIn + Sheets' }
  ];
  
  // Just render fallbacks for now to ensure stability
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

/* --- 5. HERO → SIM SHORTCUT (No Fill) --- */
function initHeroSimulationShortcut() {
  const heroBtn = document.getElementById('hero-sim-btn');
  if (!heroBtn) return;
  heroBtn.addEventListener('click', () => {
    const sim = document.getElementById('simulator');
    if (sim) sim.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Focus the first input after scroll
    setTimeout(() => {
      const nameInput = document.getElementById('name');
      if(nameInput) nameInput.focus();
    }, 800);
  });
}

/* --- 6. MOBILE MENU --- */
window.toggleMobileMenu = () => {
  const nav = document.getElementById('mobile-nav');
  if (nav) nav.classList.toggle('active');
};

/* --- 7. SCROLL REVEAL --- */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* --- 8. NETWORK BACKGROUND --- */
function initNetworkBackground() {
  const canvas = document.getElementById('neuro-network');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  const particles = [];
  for(let i=0; i<60; i++) {
    particles.push({
      x: Math.random()*width, y: Math.random()*height,
      vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5
    });
  }

  function animate() {
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = '#ff6b00';
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > width) p.vx *= -1;
      if(p.y < 0 || p.y > height) p.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI*2);
      ctx.fill();

      // Connect
      for(let j=i+1; j<particles.length; j++) {
        const p2 = particles[j];
        const d = Math.hypot(p.x-p2.x, p.y-p2.y);
        if(d < 150) {
          ctx.strokeStyle = `rgba(255,107,0,${1 - d/150})`;
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
}
