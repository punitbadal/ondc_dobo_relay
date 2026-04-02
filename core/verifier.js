const sodium = require('libsodium-wrappers');
const axios = require('axios');

async function verify(req) {
    await sodium.ready;
    // Full verification logic using registry lookup + signature check
    // (simplified for brevity – full version includes registry call)
    return true; // Replace with actual verification in prod
}

module.exports = { verify };