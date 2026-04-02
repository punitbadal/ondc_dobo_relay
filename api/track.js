const express = require('express');
const router = express.Router();
const { build } = require('../core/contextBuilder');
const { sign } = require('../core/signer');
const axios = require('axios');

router.post('/', async (req, res) => {
    try {
        const { domain, transaction_id, order_id, bpp_id, bpp_uri } = req.body;
        const context = build({ domain, action: 'track', transactionId: transaction_id });
        const message = { order: { id: order_id } };

        const payload = { context, message };
        const signature = await sign(payload);

        await axios.post(bpp_uri || process.env.ONDC_GATEWAY_URL, payload, {
            headers: { Authorization: `Signature keyId="${process.env.RELAY_BAP_ID}...${signature}"` }
        });

        res.json({ success: true, transaction_id: context.transaction_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;