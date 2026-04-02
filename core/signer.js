const sodium = require('libsodium-wrappers');

async function sign(payload) {
    await sodium.ready;
    const privateKey = sodium.from_base64(process.env.RELAY_SIGNING_PRIVATE_KEY);
    const message = Buffer.from(JSON.stringify(payload));
    const signature = sodium.crypto_sign_detached(message, privateKey);
    return sodium.to_base64(signature);
}

module.exports = { sign };