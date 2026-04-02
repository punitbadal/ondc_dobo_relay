const axios = require('axios');

/**
 * Buyer App Forwarding Client
 * Pushes validated ONDC callbacks from the relay to your NestJS backend.
 */
async function push(eventData) {
    const { event } = eventData;
    
    // Normalize event name for NestJS controllers (e.g. on_search -> onSearch)
    const normalizedEvent = event.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    
    const targetUrl = `${process.env.APP_BACKEND_WEBHOOK_URL}/${normalizedEvent}`;

    try {
        console.log(`Forwarding callback [${event}] to backend: ${targetUrl}`);
        await axios.post(targetUrl, eventData, {
            headers: { 
                Authorization: `Bearer ${process.env.APP_BACKEND_WEBHOOK_SECRET || ''}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        console.error(`Backend push failed for [${event}]: ${e.response?.data || e.message}`);
    }
}

module.exports = { push };