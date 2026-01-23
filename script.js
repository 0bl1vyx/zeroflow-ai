/* --- CONFIG & DATA (HARDCODED FOR STABILITY) --- */
const projects = [
  {
    id: "amazon-lead-gen",
    title: "Amazon PPC Lead Generator",
    type: "Client Project",
    tags: ["n8n", "Scraping", "Sales"],
    image: "projects/Local Gyms Lead Finder.png", // Using your uploaded image
    intro: "Automated scraping system that identifies high-value leads by analyzing tech stacks.",
    problem: "Client was spending 15 hours/week manually checking agency websites to find sales targets. Hiring a VA was too slow and error-prone.",
    solution: "Designed an n8n workflow that ingests domain lists, scrapes HTML content to detect specific WordPress versions, and filters qualified leads directly into a CRM.",
    tech_stack: ["n8n (Self-Hosted)", "Puppeteer", "Regex Logic", "Google Sheets"],
    result: "Reduced manual research time by 95%. Client now receives a qualified list of leads every Monday morning automatically."
  },
  {
    id: "bug-bounty-finder",
    title: "Bug Bounty Program Finder",
    type: "Internal Tool",
    tags: ["Security", "Automation", "LLM"],
    image: "projects/Self Hosted BugBounty Programs Finder.png",
    intro: "A recon system that finds self-hosted bug bounty programs hidden on the web.",
    problem: "Finding private bug bounty programs requires hours of 'Google Dorking' and manual verification.",
    solution: "Built an autonomous agent that searches specific dorks, visits the target sites, and uses a Gemini 1.5 Flash model to read the policy page and confirm if it's a valid bounty program.",
    tech_stack: ["Google Search API", "Gemini 1.5 Flash", "n8n Loop", "HTTP Request"],
    result: "Found 20+ valid programs in the first run that were not listed on major platforms like HackerOne."
  },
  {
    id: "personal-agent",
    title: "Telegram Personal AI Agent",
    type: "Personal System",
    tags: ["AI Agent", "Telegram", "RAG"],
    image: "projects/personal-ai-agent.png",
    intro: "A JARVIS-like assistant that lives in Telegram and controls my entire digital life.",
    problem: "Switching between apps (Calendar, Notes, Weather, Search) on mobile is inefficient.",
    solution: "Created a centralized Telegram bot connected to an n8n backend. It uses function calling to check my calendar, save notes to Notion, and answer complex queries via Perplexity logic.",
    tech_stack: ["Telegram API", "OpenAI Function Calling", "Notion API", "Postgres"],
    result: "Handles 50+ tasks per day via simple text commands. Zero context switching."
  }
];

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  
  renderProjects();
  initScrollReveal();
  initCursor();
  initTilt();
  initNetworkBackground();
  initSimulation();
});

/* --- 1. RENDER CASE STUDIES --- */
function renderProjects() {
  const grid = document.getElementById('project-grid');
  if(!grid) return;
  grid.innerHTML = '';

  projects.forEach((p, index) => {
    // Create Card
    const card = document.createElement('article');
    card.className = 'project-card reveal';
    card.style.animationDelay = `${index * 100}ms`;
    card.innerHTML = `
      <div class="project-thumb">
        <img src="${p.image}" alt="${p.title}" onerror="this.src='https://placehold.co/600x400/111/333?text=System+Schematic'">
      </div>
      <div class="project-meta">
        <h3>${p.title}</h3>
        <p>${p.intro}</p>
        <div class="tech-tags">
          ${p.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>
    `;
    
    // Click Event -> Open Modal
    card.addEventListener('click', () => openModal(p));
    grid.appendChild(card);
  });
}

/* --- 2. MODAL LOGIC --- */
const modal = document.getElementById('project-modal');

function openModal(project) {
  // Populate Data
  document.getElementById('m-title').innerText = project.title;
  document.getElementById('m-type').innerText = project.type;
  document.getElementById('m-desc').innerText = project.intro;
  document.getElementById('m-image').src = project.image;
  
  document.getElementById('m-problem').innerText = project.problem;
  document.getElementById('m-solution').innerText = project.solution;
  document.getElementById('m-result').innerText = project.result;

  const stackList = document.getElementById('m-stack');
  stackList.innerHTML = '';
  project.tech_stack.forEach(tech => {
    const li = document.createElement('li');
    li.innerText = tech;
    stackList.appendChild(li);
  });

  // Show
  document.body.style.overflow = 'hidden'; // Lock scroll
  modal.classList.add('open');
}

window.closeModal = () => {
  modal.classList.remove('open');
  document.body.style.overflow = 'auto'; // Unlock scroll
};

// Close on Escape or Outside Click
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });
modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });


/* --- 3. ANIMATION & FX --- */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('active'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if(!dot || !outline || window.innerWidth < 768) return;

  window.addEventListener('mousemove', (e) => {
    const x = e.clientX; const y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px)`;
    // Slight delay for outline
    outline.animate({ transform: `translate(${x}px, ${y}px)` }, { duration: 500, fill: 'forwards' });
  });

  // Hover effects
  document.querySelectorAll('a, button, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => outline.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(1.5)`);
    el.addEventListener('mouseleave', () => outline.style.transform = `scale(1)`);
  });
}

function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xRot = -1 * ((y - rect.height/2) / 20);
      const yRot = (x - rect.width/2) / 20;
      card.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)');
  });
}

/* --- 4. SIMULATION --- */
function initSimulation() {
  const runBtn = document.getElementById('runBtn');
  const consoleOut = document.getElementById('console-output');
  
  if(!runBtn) return;

  document.getElementById('agentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    runBtn.innerHTML = '<i data-lucide="loader" class="spin"></i> RUNNING...';
    consoleOut.innerHTML = '';
    
    // Simulate steps
    const steps = [
      { msg: "> Webhook received. Parsing payload...", node: "node-1" },
      { msg: "> AI analyzing sentiment...", node: "node-2" },
      { msg: "> Logic Path: Negative Sentiment Detected", node: "node-2" },
      { msg: "> Drafting response draft...", node: "node-3" },
      { msg: "> SUCCESS: Email queued.", node: "node-3", status: true }
    ];

    let i = 0;
    function nextStep() {
      if(i >= steps.length) {
        runBtn.innerHTML = '<i data-lucide="check"></i> DONE';
        setTimeout(() => { runBtn.innerHTML = '<i data-lucide="play"></i> EXECUTE'; }, 2000);
        return;
      }
      
      const step = steps[i];
      // Highlight Node
      document.querySelectorAll('.node').forEach(n => n.classList.remove('active'));
      document.getElementById(step.node).classList.add('active');
      
      // Log
      const p = document.createElement('div');
      p.className = 'log-line';
      p.innerText = step.msg;
      if(step.status) { p.style.color = '#22c55e'; document.querySelector('.status-dot').classList.add('active'); }
      consoleOut.appendChild(p);
      
      i++;
      setTimeout(nextStep, 800);
    }
    nextStep();
  });
}

/* --- 5. NETWORK BG --- */
function initNetworkBackground() {
  const canvas = document.getElementById('neuro-network');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  
  const resize = () => { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; };
  window.addEventListener('resize', resize); resize();
  
  const points = Array.from({length: 30}).map(() => ({
    x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5
  }));

  function animate() {
    ctx.clearRect(0,0,w,h);
    points.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > w) p.vx *= -1;
      if(p.y < 0 || p.y > h) p.vy *= -1;
      ctx.fillStyle = 'rgba(255,107,0,0.3)'; ctx.beginPath(); ctx.arc(p.x,p.y,2,0,Math.PI*2); ctx.fill();
    });
    // Connect
    points.forEach((p, i) => {
      for(let j=i+1; j<points.length; j++) {
        const d = Math.hypot(p.x-points[j].x, p.y-points[j].y);
        if(d < 150) {
          ctx.strokeStyle = `rgba(255,107,0,${0.1 * (1 - d/150)})`;
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(points[j].x, points[j].y); ctx.stroke();
        }
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
}
