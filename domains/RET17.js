const base = require('./base');
const { indexTags } = require('../utils/tagHelpers');

module.exports = {
    ...base,

    normalizeItem(raw) {
        const item = base.normalizeItem(raw);
        const attrs = indexTags(raw.tags);

        item.attributes = {
            manufacturer_name: attrs.manufacturer_or_packer_name,
            net_quantity: attrs.net_quantity,
            country_of_origin: attrs.country_of_origin,
            brand: attrs.brand
        };
        return item;
    }
};