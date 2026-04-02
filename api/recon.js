const express = require('express');
const router = express.Router();
const { build } = require('../core/contextBuilder');
const { sign } = require('../core/signer');
const axios = require('axios');

router.post('/', async (req, res) => {
    try {
        const { transaction_id, orders } = req.body;
        const context = build({ domain: 'ONDC:NTS10', action: 'recon', transactionId: transaction_id });

        const message = { orders };

        const payload = { context, message };
        const signature = await sign(payload);

        await axios.post(process.env.RSF_RSP_URL, payload, {
            headers: { Authorization: `Signature keyId="${process.env.RELAY_BAP_ID}...${signature}"` }
        });

        res.json({ success: true, transaction_id: context.transaction_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;