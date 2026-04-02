const base = require('./base');
const { indexTags } = require('../utils/tagHelpers');

module.exports = {
    ...base,

    normalizeItem(raw) {
        const item = base.normalizeItem(raw);
        const attrs = indexTags(raw.tags);

        item.attributes = {
            brand: attrs.brand,
            skin_type: attrs.skin_type,
            concern: attrs.concern,
            ingredient: attrs.ingredient,
            net_quantity: attrs.net_quantity,
            colour: attrs.colour,
            colour_name: attrs.colour_name,
            conscious: attrs.conscious,
            subtype: attrs.subtype,
            country_of_origin: attrs.country_of_origin
        };
        return item;
    }
};