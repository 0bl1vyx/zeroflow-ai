document.getElementById('automationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    const form = document.getElementById('automationForm');
    const successMsg = document.getElementById('successMessage');

    // 1. Get Data
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        problem: document.getElementById('problem').value
    };

    // 2. Show Loading State
    btn.textContent = "Processing...";
    btn.disabled = true;

    try {
        // 3. Send to Vercel API
        const response = await fetch('/api/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // 4. Show Success
            form.classList.add('hidden');
            successMsg.classList.remove('hidden');
        } else {
            alert('Error triggering automation. Please try again.');
            btn.textContent = "Generate Solution";
            btn.disabled = false;
        }
    } catch (error) {
        console.error(error);
        alert('Something went wrong.');
    }
});
