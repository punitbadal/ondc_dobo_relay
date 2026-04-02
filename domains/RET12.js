// domains/RET12.js
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
            colour_name: attrs.colour_name,           // mandatory per spec
            size: attrs.size,
            gender: attrs.gender,
            material: attrs.material,
            fabric: attrs.fabric,
            pattern: attrs.pattern,
            occasion: attrs.occasion,
            fit: attrs.fit,
            care: attrs.care,
            age_group: attrs.age_group,
            country_of_origin: attrs.country_of_origin
        };

        item.variant_group_id = raw.tags?.find(t => t.code === "variant")?.list?.find(l => l.code === "group_id")?.value;
        item.size_chart_url = raw.tags?.find(t => t.code === "size_chart")?.list?.find(l => l.code === "url")?.value;

        return item;
    }
};