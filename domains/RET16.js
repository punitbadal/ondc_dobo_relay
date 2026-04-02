const base = require('./base');
const { indexTags } = require('../utils/tagHelpers');

module.exports = {
    ...base,

    normalizeItem(raw) {
        const item = base.normalizeItem(raw);
        const attrs = indexTags(raw.tags);

        item.attributes = {
            brand: attrs.brand,
            ingredients_info: attrs.ingredients_info,
            manufacturer_name: attrs.manufacturer_or_packer_name,
            manufacturer_address: attrs.manufacturer_or_packer_address,
            net_quantity: attrs.net_quantity,
            formulation: attrs.formulation,
            country_of_origin: attrs.country_of_origin
        };
        return item;
    }
};