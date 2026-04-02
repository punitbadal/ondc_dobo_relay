const base = require('./base');
const { indexTags } = require('../utils/tagHelpers');

module.exports = {
    ...base,

    normalizeItem(raw) {
        const item = base.normalizeItem(raw);
        const tags = indexTags(raw.tags);

        item.attributes = {
            net_quantity: tags.net_quantity || tags.net_quantity_or_measure_of_commodity_in_pkg,
            manufacturer_name: tags.manufacturer_or_packer_name,
            manufacturer_address: tags.manufacturer_or_packer_address,
            nutritional_info: tags.nutritional_info,
            ingredients_info: tags.ingredients_info,
            mfg_license_no: tags.mfg_license_no,
            country_of_origin: tags.country_of_origin,
            brand: tags.brand,
            veg_nonveg: tags.veg_nonveg,
            expiry_date: tags.expiry_date
        };
        return item;
    }
};