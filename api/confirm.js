const express = require('express');
const router = express.Router();
const { build } = require('../core/contextBuilder');
const { sign } = require('../core/signer');
const DomainRegistry = require('../config/domainRegistry');
const axios = require('axios');

router.post('/', async (req, res) => {
    try {
        const { 
            domain, 
            transaction_id, 
            TransactionId,
            bpp_id, 
            BppId,
            bpp_uri, 
            bpp_url,
            BppUri,
            provider_id, 
            ProviderId,
            OrderId,
            OrderAmount,
            PaymentStatus,
            PaymentType,
            PaymentCollectedBy,
            items, 
            listItems 
        } = req.body;

        const context = build({ ...req.body, action: 'confirm' });

        const message = {
            order: {
                id: OrderId,
                state: "Created",
                provider: { id: provider_id || ProviderId },
                items: (items || listItems || []).map(item => ({
                    id: item.id || item.ItemId,
                    quantity: item.quantity || { count: item.Quantity },
                    location_id: item.location_id || item.LocationId,
                    fulfillment_id: item.fulfillment_id || item.FulfillmentId || '1'
                })),
                payment: {
                    params: {
                        amount: OrderAmount,
                        currency: "INR"
                    },
                    status: PaymentStatus || "PAID",
                    type: PaymentType || "ON-ORDER",
                    collected_by: PaymentCollectedBy || "BAP",
                    "@ondc/org/buyer_app_finder_fee_type": "percent",
                    "@ondc/org/buyer_app_finder_fee_amount": "5"
                },
                quote: {
                    price: {
                        currency: "INR",
                        value: OrderAmount
                    }
                }
            }
        };

        const payload = { context, message };
        const signature = await sign(payload);

        const created = Math.floor(Date.now() / 1000);
        const expires = created + 3600;

        await axios.post(bpp_uri || BppUri || bpp_url || process.env.ONDC_GATEWAY_URL, payload, {
            headers: { 
                Authorization: `Signature keyId="${process.env.RELAY_BAP_ID}|${process.env.UNIQUE_KEY_ID || '1'}|ed25519",algorithm="ed25519",created="${created}",expires="${expires}",headers="(created) (expires) digest",signature="${signature}"`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ success: true, transaction_id: context.transaction_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;