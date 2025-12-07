// INITIALIZE ICONS
lucide.createIcons();

/* =========================================
   SCROLL REVEAL ANIMATION
   ========================================= */
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* =========================================
   DYNAMIC PORTFOLIO CONFIG
   ========================================= */
// UPDATE THIS LIST WITH YOUR ACTUAL FILENAMES IN 'projects/' FOLDER
const myProjects = [
    "Personal Ai Agent.png",
    // "Lead Gen System.png",
    // "Automation Dashboard.jpg" 
];

const grid = document.getElementById('project-grid');

function formatTitle(filename) {
    let name = filename.replace(/\.[^/.]+$/, ""); // Remove extension
    return name;
}

if (grid) {
    if(myProjects.length > 0) {
        myProjects.forEach(filename => {
            const title = formatTitle(filename);
            // Be sure images are in 'projects/' folder
            grid.innerHTML += `
                <div class="project-card reveal" onclick="openLightbox('projects/${filename}')">
                    <img src="projects/${filename}" alt="${title}">
                    <div class="card-overlay">
                        <h3>${title}</h3>
                    </div>
                </div>
            `;
        });
    } else {
        grid.innerHTML = '<p style="color:#666; width:100%; text-align:center;">Workflows loading from GitHub...</p>';
    }
}

/* =========================================
   LIGHTBOX LOGIC
   ========================================= */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; 
}

if(lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

/* =========================================
   TERMINAL / FIVERR FUNNEL LOGIC
   ========================================= */
const form = document.getElementById('agentForm');
const output = document.getElementById('console-output');
const btn = document.getElementById('runBtn');

if(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // VISUAL FX
        btn.innerHTML = "CONNECTING TO NEURAL NET <span class='blink'>_</span>";
        btn.style.opacity = "0.7";
        btn.disabled = true;

        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            problem: document.getElementById('problem').value
        };

        try {
            // Attempt to trigger GitHub Action
            const res = await fetch('/api/trigger', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });

            // Simulate "Processing" time for effect
            await new Promise(r => setTimeout(r, 1500));

            if(res.ok) {
                form.style.display = 'none';
                output.style.display = 'block';
                
                // THE FIVERR FUNNEL MESSAGE
                output.innerHTML = `
                    <div style="font-family:'Courier New';">
                        > <span style="color:#27c93f">[SUCCESS]</span> UPLINK ESTABLISHED.<br>
                        > <span style="color:var(--neon-orange)">[SYSTEM]</span> ANALYZING REQUEST PARAMS...<br>
                        > <span style="color:var(--neon-orange)">[SYSTEM]</span> GENERATING ARCHITECTURE... DONE.<br><br>
                        
                        <div style="border:1px solid var(--neon-orange); padding:15px; background:rgba(255,107,0,0.05);">
                            <b>> MISSION STATUS: PENDING APPROVAL</b><br><br>
                            I have received your request. To proceed with the build, please select the 
                            <b>STANDARD PACKAGE</b> on my secure gateway.<br><br>
                            
                            <a href="https://www.fiverr.com/yodhyam_gamedev/build-a-complete-ai-chatbot-for-your-website-using-chatbase" 
                               target="_blank" 
                               style="background:var(--neon-orange); color:white; padding:10px 20px; text-decoration:none; font-weight:bold; display:inline-block; margin-top:10px;">
                               EXECUTE ORDER 66 (OPEN FIVERR)
                            </a>
                        </div>
                    </div>
                `;
            } else {
                throw new Error("API Error");
            }
        } catch(err) {
            console.error(err);
            // Fallback if API fails (still funnel them!)
            form.style.display = 'none';
            output.style.display = 'block';
            output.innerHTML = `
                > <span style="color:#ff2a2a">[ERROR]</span> SERVER BUSY.<br>
                > Please contact directly via the secure gateway below:<br><br>
                <a href="https://www.fiverr.com/yodhyam_gamedev/build-a-complete-ai-chatbot-for-your-website-using-chatbase" target="_blank" style="color:white; text-decoration:underline;">
                    CLICK TO OPEN MANUAL UPLINK (FIVERR)
                </a>
            `;
        }
    });
}
