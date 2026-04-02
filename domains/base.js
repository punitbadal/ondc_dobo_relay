// domains/base.js
const { findTag, indexTags } = require('../utils/tagHelpers');

module.exports = {
    normalizeItem(raw) {
        return {
            id: raw.id,
            name: raw.descriptor?.name,
            description: raw.descriptor?.short_desc,
            long_description: raw.descriptor?.long_desc,
            images: raw.descriptor?.images || [],
            price: {
                value: raw.price?.value,
                maximum_value: raw.price?.maximum_value,
                currency: raw.price?.currency || "INR"
            },
            category_id: raw.category_id,
            fulfillment_id: raw.fulfillment_id,
            location_id: raw.location_id,
            available_qty: raw.quantity?.available?.count,
            maximum_qty: raw.quantity?.maximum?.count,

            // Common ONDC meta fields (always extracted)
            ondc_meta: {
                returnable: raw["@ondc/org/returnable"],
                cancellable: raw["@ondc/org/cancellable"],
                return_window: raw["@ondc/org/return_window"],
                time_to_ship: raw["@ondc/org/time_to_ship"],
                cod_available: raw["@ondc/org/cod"],
                seller_pickup_return: raw["@ondc/org/seller_pickup_return"],
                available_on_cod: raw["@ondc/org/available_on_cod"]
            },

            // Domain-specific attributes (overridden by each domain)
            attributes: {},

            // Full raw payload - safety net for 100% coverage
            raw: raw
        };
    }
};