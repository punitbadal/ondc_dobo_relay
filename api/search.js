const express = require('express');
const router = express.Router();
const { build } = require('../core/contextBuilder');
const { sign } = require('../core/signer');
const DomainRegistry = require('../config/domainRegistry');
const axios = require('axios');

router.post('/', async (req, res) => {
    try {
        const { domain } = req.body;
        const config = DomainRegistry.get(domain);

        const context = build({ domain, action: 'search', cityCode: req.body.city_code, ...req.body });
        const message = { intent: { /* built based on search_strategy */ } };

        const payload = { context, message };
        const signature = await sign(payload);

        await axios.post(process.env.ONDC_GATEWAY_URL, payload, {
            headers: { Authorization: `Signature ...` }
        });

        res.json({ success: true, transaction_id: context.transaction_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;