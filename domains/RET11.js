// domains/RET11.js
const base = require('./base');
const { indexTags } = require('../utils/tagHelpers');

module.exports = {
    ...base,

    normalizeItem(raw) {
        const item = base.normalizeItem(raw);
        const tags = indexTags(raw.tags);

        item.attributes = {
            veg_nonveg: tags.veg_nonveg,
            food_type: tags.food_type,
            category: tags["@ondc/org/category_ids"] || raw.category_id,
            fssai_license: raw["@ondc/org/fssai_license_no"]
        };

        // F&B specific: customization groups
        item.customization_groups = (raw.tags || [])
            .filter(t => t.code === "custom_group")
            .map(cg => ({
                id: findTag(cg.list, "id"),
                name: findTag(cg.list, "name"),
                min: parseInt(findTag(cg.list, "min") || 0),
                max: parseInt(findTag(cg.list, "max") || 0),
                input: findTag(cg.list, "input"),
                seq: parseInt(findTag(cg.list, "seq") || 0)
            }));

        return item;
    }
};