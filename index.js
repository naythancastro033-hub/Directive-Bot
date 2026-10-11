// Configuration pointing to your Render backend service
const RENDER_BACKEND_URL = 'https://directive-bot.onrender.com';

/**
 * Fetch telemetry data from the Render backend.
 */
async function fetchTelemetry() {
    try {
        const response = await fetch(`${RENDER_BACKEND_URL}/api/telemetry`);
        if (!response.ok) throw new Error('Telemetry network response was not ok');
        
        const data = await response.json();
        
        // Update dashboard UI elements
        const pingElement = document.getElementById('gateway-latency');
        const guildElement = document.getElementById('active-guilds');

        if (pingElement) pingElement.textContent = `${data.ping} ms`;
        if (guildElement) guildElement.textContent = data.guildCount;

    } catch (error) {
        console.error('[Directive™ Control Error] Failed to fetch telemetry:', error);
    }
}

/**
 * Verify Admin Key against the Render backend.
 * @param {string} adminKey - The developer key entered by the user.
 */
async function verifyAdminKey(adminKey) {
    try {
        const response = await fetch(`${RENDER_BACKEND_URL}/api/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: adminKey })
        });

        const result = await response.json();
        if (result.success) {
            console.log('[Directive™ Control] Authorization successful.');
            return true;
        } else {
            console.warn('[Directive™ Control] Authorization failed:', result.message);
            return false;
        }
    } catch (error) {
        console.error('[Directive™ Control Error] Verification request failed:', error);
        return false;
    }
}

// Automatically poll telemetry every 5 seconds once loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchTelemetry();
    setInterval(fetchTelemetry, 5000);
});
