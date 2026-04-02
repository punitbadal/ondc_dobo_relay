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

    // 2. Immediate ACK (mandatory for ONDC)
    res.status(200).json({
        context,
        message: { ack: { status: "ACK" } }
    });

    // 3. Early exit if payload is invalid
    if (!context || !context.domain) return;

    // 4. Signature verification
    const isValidSignature = await verify(req);
    if (!isValidSignature) {
        console.warn(`[Callback] Signature verification failed for ${action} | message_id: ${context.message_id}`);
        return;
    }

    // 5. Deduplication
    const isDup = await isDuplicate(context.message_id);
    if (isDup) {
        console.log(`[Callback] Duplicate ${action} ignored | message_id: ${context.message_id}`);
        return;
    }

    try {
        const domainConfig = DomainRegistry.get(context.domain);
        let normalizedData = {};

        // Special handling for on_search - Extract and normalize store/provider data
        if (action === 'on_search') {
            const catalog = message?.catalog || {};

            const normalizedStores = (catalog['bpp/providers'] || []).map(provider =>
                domainConfig.normalizer.normalizeProvider(provider)
            );

            normalizedData = {
                stores: normalizedStores,
                // You can add normalized items here in future if needed
            };
        }
        // For all other callbacks, use domain-specific normalizer if available
        else {
            const normalizeFn = domainConfig.normalizer?.[`normalize_${action}`];
            if (typeof normalizeFn === 'function') {
                normalizedData = normalizeFn(message);
            } else {
                normalizedData = message || {};
            }
        }

        // 6. Push to your Buyer Backend
        // We send BOTH: clean normalized data + full original raw payload for 100% coverage
        await push({
            event: action,
            domain: context.domain,
            domain_label: domainConfig.label,
            transaction_id: context.transaction_id,
            message_id: context.message_id,
            bpp_id: context.bpp_id,
            timestamp: context.timestamp,
            normalized: normalizedData,           // Clean, usable data
            raw: req.body,                        // Full original ONDC payload (safety net)
            error: error || null
        });

        console.log(`[Callback Success] ${action} | domain: ${context.domain} | txn: ${context.transaction_id}`);
    } catch (err) {
        console.error(`[Callback Error] ${action}:`, err.message);
        // Never throw here — we already sent ACK
    }
});

module.exports = router;