const axios = require('axios');

async function push(eventData) {
    try {
        await axios.post(process.env.APP_BACKEND_WEBHOOK_URL, eventData, {
            headers: { Authorization: `Bearer ${process.env.APP_BACKEND_WEBHOOK_SECRET}` }
        });
    } catch (e) {
        console.error('Webhook push failed:', e.message);
    }
}

module.exports = { push };