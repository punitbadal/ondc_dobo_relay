const { v4: uuidv4 } = require('uuid');

function build({ domain, action, cityCode, bppId, bppUri, transactionId }) {
    const config = require('../config/domainRegistry').get(domain);
    return {
        domain,
        action,
        country: "IND",
        city: cityCode,
        core_version: config.core_version,
        bap_id: process.env.RELAY_BAP_ID,
        bap_uri: process.env.RELAY_CALLBACK_URL,
        bpp_id: bppId,
        bpp_uri: bppUri,
        transaction_id: transactionId || uuidv4(),
        message_id: uuidv4(),
        timestamp: new Date().toISOString(),
        ttl: "PT30S"
    };
}

module.exports = { build };