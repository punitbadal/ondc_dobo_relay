const { v4: uuidv4 } = require('uuid');

/**
 * Standard ONDC Context Builder
 * Normalizes internal and incoming keys to ONDC v1.2.0 standard.
 */
function build(params) {
    const { 
        domain, 
        action, 
        cityCode, 
        bpp_id, 
        bpp_uri, 
        transaction_id, 
        message_id,
        // Backward compatibility for NestJS backend (CamelCase from .NET style)
        BppId,
        BppUri,
        bpp_url,
        TransactionId,
    } = params;

    const DomainRegistry = require('../config/domainRegistry');
    const config = DomainRegistry.get(domain);
    
    return {
        domain,
        action,
        country: "IND",
        city: cityCode || "std:080", // Default to Bangalore if missing
        core_version: config.core_version || "1.2.0",
        bap_id: process.env.RELAY_BAP_ID || "ondc.dobo.app",
        bap_uri: `${process.env.RELAY_CALLBACK_URL || "https://ondc.dobo.app"}/callbacks`,
        bpp_id: bpp_id || BppId,
        bpp_uri: bpp_uri || BppUri || bpp_url,
        transaction_id: transaction_id || TransactionId || uuidv4(),
        message_id: message_id || uuidv4(),
        timestamp: new Date().toISOString(),
        ttl: "PT30S"
    };
}

module.exports = { build };