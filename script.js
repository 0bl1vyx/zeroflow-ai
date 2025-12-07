lucide.createIcons();

/* --- SCROLL REVEAL --- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* --- PORTFOLIO CONFIG --- */
const myProjects = [
    "Personal Ai Agent.png" // MAKE SURE THIS FILE EXISTS IN /projects FOLDER
];
const grid = document.getElementById('project-grid');

if (grid && myProjects.length > 0) {
    myProjects.forEach(filename => {
        let title = filename.replace(/\.[^/.]+$/, "");
        grid.innerHTML += `
            <div class="project-card reveal" onclick="openLightbox('projects/${filename}')">
                <img src="projects/${filename}" alt="${title}">
                <div class="card-overlay"><h3>${title}</h3></div>
            </div>
        `;
    });
} else if (grid) {
    grid.innerHTML = '<p style="color:#666; text-align:center;">No projects loaded.</p>';
}

/* --- LIGHTBOX --- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
}
function closeLightbox() {
    lightbox.classList.remove('active');
}
if(lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

/* --- TERMINAL FORM --- */
const form = document.getElementById('agentForm');
const output = document.getElementById('console-output');
const btn = document.getElementById('runBtn');

if(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        btn.innerHTML = "CONNECTING... <span class='blink'>_</span>";
        btn.disabled = true;

        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            problem: document.getElementById('problem').value
        };

        try {
            const res = await fetch('/api/trigger', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });

            await new Promise(r => setTimeout(r, 1500)); // Fake processing time

            if(res.ok) {
                form.style.display = 'none';
                output.style.display = 'block';
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
                    </div>`;
            } else { throw new Error("API Fail"); }
        } catch(err) {
            form.style.display = 'none';
            output.style.display = 'block';
            output.innerHTML = `> <span style="color:#ff2a2a">[ERROR]</span> SERVER BUSY. <a href="https://www.fiverr.com/yodhyam_gamedev/build-a-complete-ai-chatbot-for-your-website-using-chatbase" style="color:white;">OPEN MANUAL UPLINK</a>`;
        }
    });
}
