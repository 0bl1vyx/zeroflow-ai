/* =========================================
   1. INITIALIZATION & UTILS
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initScrollReveal();
    loadProjects();
});

/* =========================================
   2. MOBILE MENU
   ========================================= */
function toggleMobileMenu() {
    const nav = document.getElementById('mobile-nav');
    nav.classList.toggle('active');
}

/* =========================================
   3. SCROLL REVEAL ANIMATION
   ========================================= */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* =========================================
   4. AUTO-LOAD PROJECTS (API)
   ========================================= */
async function loadProjects() {
    const grid = document.getElementById('project-grid');
    if(!grid) return;

    try {
        // Fetch list of images from our Vercel API
        const response = await fetch('/api/projects');
        const images = await response.json();

        if (images.length > 0) {
            grid.innerHTML = ''; // Clear loader
            
            images.forEach((filename, index) => {
                // Clean filename for display (remove ext, replace hyphens)
                let title = filename.replace(/\.[^/.]+$/, "").replace(/-/g, " ");
                title = title.replace(/\b\w/g, l => l.toUpperCase()); // Capitalize

                // Add delay for staggering effect
                const delay = index * 100;

                const card = `
                    <div class="project-card reveal" style="transition-delay: ${delay}ms" 
                         onclick="openLightbox('projects/${filename}', '${title}')">
                        <img src="projects/${filename}" alt="${title}" loading="lazy">
                    </div>
                `;
                grid.innerHTML += card;
            });

            // Re-init observer for new elements
            setTimeout(() => {
                lucide.createIcons();
                document.querySelectorAll('.project-card').forEach(el => {
                    // Manually trigger observer logic if needed or just add class
                    el.classList.add('active'); 
                });
            }, 100);

        } else {
            grid.innerHTML = '<p style="text-align:center; color:#555; width:100%;">No case studies found.</p>';
        }
    } catch (error) {
        console.error("Failed to load projects:", error);
        grid.innerHTML = '<p style="text-align:center; color:#555; width:100%;">Database Connection Error.</p>';
    }
}

/* =========================================
   5. LIGHTBOX SYSTEM
   ========================================= */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCap = document.getElementById('lightbox-caption');

window.openLightbox = (src, title) => { 
    lightbox.style.display = 'flex'; 
    lightboxImg.src = src; 
    lightboxCap.innerText = title || "Workflow Detail";
    document.body.style.overflow = 'hidden'; // Lock scroll
};

window.closeLightbox = () => { 
    lightbox.style.display = 'none'; 
    document.body.style.overflow = 'auto'; // Unlock scroll
};

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

/* =========================================
   6. DEMO SIMULATOR LOGIC
   ========================================= */
const demoForm = document.getElementById('agentForm');
const runBtn = document.getElementById('runBtn');
const consoleOut = document.getElementById('console-output');

if(demoForm) {
    demoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // --- STEP 0: PREPARE UI ---
        runBtn.disabled = true;
        runBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Initializing Agent...';
        lucide.createIcons();
        consoleOut.innerHTML = ''; // Clear logs
        
        // Reset Visuals
        document.querySelectorAll('.node').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.connector').forEach(el => el.classList.remove('active'));

        // Helper for logs
        const log = (msg, type = '') => {
            const time = new Date().toLocaleTimeString([], { hour12: false });
            consoleOut.innerHTML += `<div class="log-line ${type}">[${time}] ${msg}</div>`;
            consoleOut.scrollTop = consoleOut.scrollHeight;
        };

        log("System initialized.", "text-muted");

        // --- STEP 1: WEBHOOK TRIGGER ---
        await wait(500);
        activateNode('node-1');
        log("Webhook received payload.", "processing");
        
        // --- STEP 2: TRANSITION TO AI ---
        await wait(500);
        activateConn('conn-1');
        await wait(800);
        
        // --- STEP 3: AI PROCESSING ---
        activateNode('node-2');
        log("AI analyzing intent...", "processing");
        const problem = document.getElementById('problem').value.substring(0, 20) + "...";
        log(`Context extracted: "${problem}"`);
        
        // --- STEP 4: TRANSITION TO EXECUTION ---
        await wait(1500);
        activateConn('conn-2');
        
        // --- STEP 5: EXECUTION ---
        activateNode('node-3');
        log("Generating automation strategy...", "processing");
        log("Accessing Vector Database... [OK]");
        
        // --- STEP 6: OUTPUT ---
        await wait(1200);
        activateConn('conn-3');
        activateNode('node-4');
        log("Drafting email report...", "processing");

        // --- STEP 7: SEND REAL DATA (OPTIONAL) ---
        // This actually hits your API so you get the lead!
        try {
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                problem: document.getElementById('problem').value
            };
            
            // Fire and forget (don't wait for response to keep animation smooth)
            fetch('/api/trigger', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
        } catch(e) { console.log("Offline mode"); }

        // --- STEP 8: FINISH ---
        await wait(500);
        log("MISSION COMPLETE. Email dispatched.", "success");
        
        runBtn.innerHTML = '<i data-lucide="check"></i> Simulation Complete';
        runBtn.style.background = '#22c55e';
        runBtn.style.boxShadow = 'none';

        // Reset button after delay
        setTimeout(() => {
            runBtn.disabled = false;
            runBtn.innerHTML = '<i data-lucide="play"></i> Run Simulation';
            runBtn.style.background = ''; // Revert to CSS
            lucide.createIcons();
        }, 5000);
    });
}

// Utility: Wait function
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
// Utility: Visual Activators
function activateNode(id) { document.getElementById(id).classList.add('active'); }
function activateConn(id) { document.getElementById(id).classList.add('active'); }
