// domains/base.js
const { findTag, indexTags } = require('../utils/tagHelpers');

module.exports = {
    /**
     * Normalize Provider / Store level data (Seller Data)
     * This captures store name, logo, banner, location, timings, contact, etc.
     */
    normalizeProvider(rawProvider) {
        return {
            provider_id: rawProvider.id,
            name: rawProvider.descriptor?.name,
            short_desc: rawProvider.descriptor?.short_desc,
            long_desc: rawProvider.descriptor?.long_desc,

            // Logo & Banner
            images: rawProvider.descriptor?.images || [],
            logo: rawProvider.descriptor?.images?.[0],
            banner: rawProvider.descriptor?.images?.[1] || rawProvider.descriptor?.images?.[0],

            // NP Type (ISN / MSN)
            np_type: findTag(rawProvider.tags, "np_type"),

            // FSSAI (important for RET11)
            fssai_license_no: rawProvider["@ondc/org/fssai_license_no"],

            // Store Locations (most important part)
            locations: (rawProvider.locations || []).map(loc => ({
                id: loc.id,
                gps: loc.gps,
                address: loc.address,
                area_code: loc.address?.area_code,
                city: loc.address?.city,
                state: loc.address?.state,
                locality: loc.address?.locality,

                // Timings
                open_now: loc.time?.label === "enable",
                label: loc.time?.label,                    // enable / disable / close / open
                timestamp: loc.time?.timestamp,
                days: loc.time?.schedule?.days,
                schedule: loc.time?.schedule,
                range: loc.time?.range,

                // Service radius
                circle: loc.circle ? {
                    gps: loc.circle.gps,
                    radius: loc.circle.radius?.value,
                    unit: loc.circle.radius?.unit
                } : null
            })),

            // Fulfillment / Delivery options at store level
            fulfillments: (rawProvider.fulfillments || []).map(f => ({
                id: f.id,
                type: f.type,
                tat: f["@ondc/org/TAT"],
                tracking: f.tracking || false,
                contact: f.contact
            })),

            // Contact (phone, email)
            contact: rawProvider.contact || null,

            // Other important tags
            tags: rawProvider.tags || [],

            // Full raw provider object (safety net)
            raw: rawProvider
        };
    },

    /**
     * Item normalization (already provided earlier)
     */
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

            ondc_meta: {
                returnable: raw["@ondc/org/returnable"],
                cancellable: raw["@ondc/org/cancellable"],
                return_window: raw["@ondc/org/return_window"],
                time_to_ship: raw["@ondc/org/time_to_ship"],
                cod_available: raw["@ondc/org/cod"],
                seller_pickup_return: raw["@ondc/org/seller_pickup_return"]
            },

            attributes: {},        // ← Overridden by each domain
            raw: raw               // Full raw item
        };
    }
};