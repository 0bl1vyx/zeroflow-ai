document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initScrollReveal();
    initCursor();
    initTilt();
    typeWriterEffect();
    loadProjects();
    initNetworkBackground(); // NEW
});

/* --- 1. TYPING EFFECT (Hero) --- */
function typeWriterEffect() {
    const el = document.querySelector('.type-effect');
    if(!el) return;
    const text = el.getAttribute('data-text');
    let i = 0;
    
    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    // Start after a small delay
    setTimeout(type, 1000);
}

/* --- 2. CUSTOM CURSOR --- */
function initCursor() {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    
    // Disable on mobile
    if(window.innerWidth < 768) return;

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;

        // Outline follows with delay
        outline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Add hover effect for clickable items
    const clickables = document.querySelectorAll('a, button, .project-card, .host-card, .terminal-header');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}

/* --- 3. 3D TILT EFFECT --- */
function initTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation based on mouse position
            const xRot = -1 * ((y - rect.height/2) / 20);
            const yRot = (x - rect.width/2) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

/* --- 4. PROJECT LOADER (Robust Fallback) --- */
async function loadProjects() {
    const grid = document.getElementById('project-grid');
    if(!grid) return;

    // Manual list as fallback if API fails
    const fallbackProjects = [
        "Personal Ai Agent.png", 
        "Lead Gen System.png", 
        "Dashboard.jpg"
    ];

    try {
        const response = await fetch('/api/projects');
        let images = await response.json();

        // Use fallback if API returns empty (common in dev environments)
        if (!images || images.length === 0) {
            console.warn("API empty, using fallback list.");
            // Filter only valid fallback images (you must ensure these files exist!)
            images = fallbackProjects; 
        }

        if (images.length > 0) {
            grid.innerHTML = ''; 
            images.forEach((filename, index) => {
                let title = filename.replace(/\.[^/.]+$/, "").replace(/-/g, " ");
                const delay = index * 100;
                grid.innerHTML += `
                    <div class="project-card reveal" style="transition-delay: ${delay}ms" 
                         onclick="openLightbox('projects/${filename}', '${title}')">
                        <img src="projects/${filename}" alt="${title}" onerror="this.style.display='none'">
                    </div>
                `;
            });
            setTimeout(() => {
                lucide.createIcons();
                initScrollReveal(); 
            }, 100);
        } else {
            grid.innerHTML = '<p style="text-align:center; color:#555;">No projects found.</p>';
        }
    } catch (error) {
        console.error("Loader failed:", error);
        grid.innerHTML = '<p style="text-align:center; color:#555;">System Offline.</p>';
    }
}

/* --- 5. MOBILE MENU --- */
window.toggleMobileMenu = () => {
    document.getElementById('mobile-nav').classList.toggle('active');
}

/* --- 6. SCROLL REVEAL --- */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* --- 7. LIGHTBOX --- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
window.openLightbox = (src, title) => { 
    lightbox.style.display = 'flex'; lightboxImg.src = src; 
    document.body.style.overflow = 'hidden'; 
};
window.closeLightbox = () => { 
    lightbox.style.display = 'none'; 
    document.body.style.overflow = 'auto'; 
};

/* --- 8. SIMULATOR LOGIC --- */
const demoForm = document.getElementById('agentForm');
const runBtn = document.getElementById('runBtn');
const consoleOut = document.getElementById('console-output');

if(demoForm) {
    demoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        runBtn.disabled = true;
        runBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Initializing...';
        lucide.createIcons();
        consoleOut.innerHTML = ''; 
        
        document.querySelectorAll('.node, .connector').forEach(el => el.classList.remove('active'));
        const log = (msg, type='') => {
            const time = new Date().toLocaleTimeString([], { hour12: false });
            consoleOut.innerHTML += `<div class="log-line ${type}">[${time}] ${msg}</div>`;
            consoleOut.scrollTop = consoleOut.scrollHeight;
        }

        log("System initialized.", "text-muted");
        await wait(500);
        
        document.getElementById('node-1').classList.add('active');
        log("Webhook Triggered.", "processing");
        await wait(800);
        document.getElementById('conn-1').classList.add('active');
        
        await wait(800);
        document.getElementById('node-2').classList.add('active');
        log("AI Agent analyzing payload...", "processing");
        await wait(1500);
        document.getElementById('conn-2').classList.add('active');
        
        await wait(800);
        document.getElementById('node-3').classList.add('active');
        log("Execution plan generated.", "processing");
        
        // Fire actual API (Fire & Forget)
        try {
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                problem: document.getElementById('problem').value
            };
            fetch('/api/trigger', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
        } catch(e) {}

        await wait(1200);
        document.getElementById('conn-3').classList.add('active');
        document.getElementById('node-4').classList.add('active');
        log("Report dispatched via Gmail.", "success");
        
        runBtn.innerHTML = '<i data-lucide="check"></i> Complete';
        runBtn.style.background = '#22c55e';
        
        setTimeout(() => {
            runBtn.disabled = false;
            runBtn.innerHTML = '<i data-lucide="play"></i> Run Simulation';
            runBtn.style.background = '';
            lucide.createIcons();
        }, 5000);
    });
}
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

/* --- 9. NEW: NETWORK BACKGROUND --- */
function initNetworkBackground() {
    const canvas = document.getElementById('neuro-network');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = 60; // Adjust for density

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

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.strokeStyle = `rgba(255, 107, 0, ${1 - dist/150})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        requestAnimationFrame(animate);
    }
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

/* --- 10. NEW: TERMINAL WIDGET --- */
window.toggleTerminal = () => {
    document.getElementById('terminal-widget').classList.toggle('open');
};

const termInput = document.getElementById('term-input');
if(termInput) {
    termInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const txt = this.value;
            if(!txt) return;
            
            const body = document.getElementById('terminal-body');
            // Add User Message
            body.innerHTML += `<div class="msg user">${txt}</div>`;
            this.value = '';
            body.scrollTop = body.scrollHeight;

            // Fake Bot Response
            setTimeout(() => {
                body.innerHTML += `<div class="msg bot">Processing request: "${txt}"... <br>Please use the form above for official inquiries.</div>`;
                body.scrollTop = body.scrollHeight;
            }, 1000);
        }
    });
}
