// callbacks/index.js
const express = require('express');
const router = express.Router();

const DomainRegistry = require('../config/domainRegistry');
const { verify } = require('../core/verifier');
const { push } = require('../core/pushClient');
const { check: isDuplicate } = require('../core/deduplicator');

// List of all supported ONDC callbacks
const SUPPORTED_CALLBACKS = [
    'on_search',
    'on_select',
    'on_init',
    'on_confirm',
    'on_status',
    'on_track',
    'on_cancel',
    'on_update',
    'on_issue',
    'on_issue_status',
    'on_recon'
];

router.post('/:action', async (req, res) => {
    const { action } = req.params;
    const { context, message, error } = req.body || {};

    // 1. Validate action
    if (!SUPPORTED_CALLBACKS.includes(action)) {
        return res.status(400).json({
            context,
            message: { ack: { status: "NACK" } },
            error: { code: "40001", message: "Unsupported callback action" }
        });
    }

    // 2. Immediate ACK (ONDC requirement - must be < 2 seconds)
    res.status(200).json({
        context,
        message: { ack: { status: "ACK" } }
    });

    // 3. Early return if no context (invalid payload)
    if (!context || !context.domain) return;

    // 4. Signature verification
    const isValidSignature = await verify(req);
    if (!isValidSignature) {
        console.warn(`[Callback] Signature verification failed for ${action}`);
        return;
    }

    // 5. Deduplication using message_id
    const isDup = await isDuplicate(context.message_id);
    if (isDup) {
        console.log(`[Callback] Duplicate ${action} ignored: ${context.message_id}`);
        return;
    }

    try {
        // 6. Get domain configuration & normalizer
        const domainConfig = DomainRegistry.get(context.domain);

        // 7. Normalize payload (domain-specific if available)
        let normalizedData = message || {};

        const normalizeFn = domainConfig.normalizer?.[`normalize_${action}`];
        if (typeof normalizeFn === 'function') {
            normalizedData = normalizeFn(message);
        }

        // 8. Push original ONDC payload to your Buyer Backend for full compatibility
        await push({
            event: action,
            ...req.body
        });

        console.log(`[Callback] ${action} processed successfully for domain ${context.domain}`);
    } catch (err) {
        console.error(`[Callback Error] ${action}:`, err.message);
        // Do not throw — we already sent ACK
    }
});

module.exports = router;