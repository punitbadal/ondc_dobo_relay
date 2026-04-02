const express = require('express');
const router = express.Router();
const { build } = require('../core/contextBuilder');
const { sign } = require('../core/signer');
const axios = require('axios');

/**
 * Modernized Search API
 * Enables Point-to-Point (P2P) targeting to specific stores or sellers.
 * Skips the slow ONDC gateway if bpp_uri is provided.
 */
router.post('/', async (req, res) => {
    try {
        const { 
            domain, 
            bpp_id, 
            bpp_uri, 
            bpp_url,
            BppId,
            BppUri,
            city_code, 
            item_name, 
            ItemName,
            category_id, 
            Category,
            gps,
            Gps,
            EndLocation 
        } = req.body;
        
        // 1. Build Context (Pass bpp_id/uri for targeting)
        const context = build({ 
            ...req.body, // Pass all for context builder to pick what it needs
            domain: domain || 'ONDC:RET12', 
            action: 'search', 
            cityCode: city_code, 
        });

        // 2. Build Intent (Mirroring your backend sync logic)
        const name = item_name || ItemName;
        const cat = category_id || Category;
        const locationGps = gps || Gps || EndLocation;

        const message = {
            intent: {
                ...(name && name !== 'Discovery' && { item: { descriptor: { name } } }),
                ...(cat && { category: { id: cat } }),
                fulfillment: {
                    type: "Delivery",
                    end: { location: { gps: locationGps || "12.97,77.59" } }
                }
            }
        };

        const payload = { context, message };
        
        // 3. Signing (Handled by core/signer module)
        const signature = await sign(payload);

        // 4. Determine Routing Destination (P2P vs Broadcast)
        const destinationUrl = bpp_uri ? `${bpp_uri}/search` : process.env.ONDC_GATEWAY_URL;

        console.log(`Relay Search: ${context.transaction_id} -> ${destinationUrl}`);

        await axios.post(destinationUrl, payload, {
            headers: { 
                Authorization: `Signature keyId="${process.env.RELAY_BAP_ID}|${process.env.UNIQUE_KEY_ID}|ed25519",algorithm="ed25519",created="${Math.floor(Date.now()/1000)}",expires="${Math.floor(Date.now()/1000)+3600}",headers="(created) (expires) digest",signature="${signature}"`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ success: true, transaction_id: context.transaction_id, destination: destinationUrl });
    } catch (err) {
        console.error(`Relay Search Failure: ${err.message}`);
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

module.exports = router;