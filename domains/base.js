const { findTag, indexTags } = require('../utils/tagHelpers');

module.exports = {
    normalizeProvider(raw) { /* full implementation as per spec */ },
    normalizeItem(raw) {
        return {
            id: raw.id,
            name: raw.descriptor?.name,
            price: { value: raw.price?.value, maximum_value: raw.price?.maximum_value },
            attributes: {},
            available_qty: raw.quantity?.available?.count
        };
    }
};