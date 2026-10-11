lucide.createIcons();

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function openAdminModal() {
    document.getElementById('admin-modal').classList.remove('hidden');
}

function closeAdminModal() {
    document.getElementById('admin-modal').classList.add('hidden');
    document.getElementById('admin-key-input').value = '';
    document.getElementById('auth-error').classList.add('hidden');
    document.getElementById('auth-form').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
}

async function handleAuth(event) {
    event.preventDefault();
    const key = document.getElementById('admin-key-input').value;
    const errorDiv = document.getElementById('auth-error');

    try {
        const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key })
        });
        const data = await response.json();

        if (data.success) {
            document.getElementById('auth-form').classList.add('hidden');
            document.getElementById('admin-panel').classList.remove('hidden');
        } else {
            errorDiv.textContent = data.message || 'Invalid Admin Developer Key.';
            errorDiv.classList.remove('hidden');
        }
    } catch (err) {
        errorDiv.textContent = 'Server communication error.';
        errorDiv.classList.add('hidden');
    }
}

async function fetchTelemetry() {
    try {
        const res = await fetch('/api/telemetry');
        const data = await res.json();
        document.getElementById('telemetry-ping').textContent = data.ping ? `${data.ping} ms` : '0 ms';
        document.getElementById('telemetry-guilds').textContent = data.guildCount || '0';
    } catch (err) {
        console.error('Failed to update telemetry widget');
    }
}

setInterval(fetchTelemetry, 5000);
fetchTelemetry();
