const base = require('./base');
const { indexTags } = require('../utils/tagHelpers');

module.exports = {
    ...base,

    normalizeItem(raw) {
        const item = base.normalizeItem(raw);
        const attrs = indexTags(raw.tags);

        item.attributes = {
            brand: attrs.brand,
            colour: attrs.colour,
            colour_name: attrs.colour_name,
            material: attrs.material,
            weight: attrs.weight,
            weight_unit: attrs.weight_unit,
            breadth: attrs.breadth,
            height: attrs.height,
            length: attrs.length,
            country_of_origin: attrs.country_of_origin
        };
        return item;
    }
};