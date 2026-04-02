const express = require('express');
const router = express.Router();
const { build } = require('../core/contextBuilder');
const { sign } = require('../core/signer');
const axios = require('axios');

router.post('/', async (req, res) => {
    try {
        const { domain, issue_id, order_id, category, short_desc, bpp_id, bpp_uri } = req.body;
        const context = build({ domain: 'ONDC:NTS10', action: 'issue' });

        const message = {
            issue: {
                id: issue_id,
                order_id,
                category,
                short_desc,
                // ... rest of IGM fields from your spec
            }
        };

        const payload = { context, message };
        const signature = await sign(payload);

        await axios.post(bpp_uri || process.env.IGM_URL, payload, {
            headers: { Authorization: `Signature keyId="${process.env.RELAY_BAP_ID}...${signature}"` }
        });

        res.json({ success: true, issue_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;