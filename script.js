/* =========================================
   DYNAMIC PORTFOLIO CONFIG
   ========================================= */
const projects = [
    // Ensure these files exist in your 'projects' folder!
    { file: "linkedin-lead-scraper.jpg", desc: "Automated extraction & enrichment." },
    { file: "customer-support-rag.jpg", desc: "AI agent handling support tickets." },
    { file: "n8n-gmail-automation.jpg", desc: "Zero-touch inbox management." },
];

const grid = document.getElementById('portfolio-grid');

function formatTitle(filename) {
    let name = filename.substring(0, filename.lastIndexOf('.'));
    name = name.replace(/[-_]/g, ' ');
    return name.replace(/\b\w/g, l => l.toUpperCase());
}

// Generate the HTML
if(grid) {
    projects.forEach(project => {
        const title = formatTitle(project.file);
        const html = `
            <div class="portfolio-item">
                <img src="projects/${project.file}" alt="${title}">
                <div class="portfolio-info">
                    <h3>${title}</h3>
                    <p>${project.desc}</p>
                </div>
            </div>
        `;
        grid.innerHTML += html;
    });
}

/* =========================================
   FORM LOGIC
   ========================================= */
const form = document.getElementById('automationForm');
if(form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btn = document.getElementById('submitBtn');
        const successMsg = document.getElementById('successMessage');

        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            problem: document.getElementById('problem').value
        };

        btn.innerHTML = 'Processing... <i data-lucide="loader-2" class="animate-spin"></i>';
        btn.disabled = true;
        lucide.createIcons(); // Re-render icon

        try {
            const response = await fetch('/api/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                form.classList.add('hidden');
                successMsg.classList.remove('hidden');
            } else {
                alert('Error triggering automation. Please try again.');
                btn.innerHTML = 'Generate Solution <i data-lucide="arrow-right"></i>';
                btn.disabled = false;
                lucide.createIcons();
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong.');
            btn.innerHTML = 'Generate Solution <i data-lucide="arrow-right"></i>';
            btn.disabled = false;
        }
    });
}
