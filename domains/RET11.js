const base = require('./base');
const { findTag, indexTags } = require('../utils/tagHelpers');

module.exports = {
    ...base,
    normalizeItem(raw) {
        const item = base.normalizeItem(raw);
        const tags = indexTags(raw.tags);
        item.attributes = {
            veg_nonveg: tags.veg_nonveg,
            food_type: tags.food_type
        };
        return item;
    }
};