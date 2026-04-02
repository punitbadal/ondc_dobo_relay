const base = require('./base');
const { indexTags } = require('../utils/tagHelpers');

module.exports = {
    ...base,

    normalizeItem(raw) {
        const item = base.normalizeItem(raw);
        const attrs = indexTags(raw.tags);

        item.attributes = {
            brand: attrs.brand,
            model: attrs.model,
            model_year: attrs.model_year,
            colour: attrs.colour,
            colour_name: attrs.colour_name,
            form_factor: attrs.form_factor,
            ram: attrs.ram,
            ram_unit: attrs.ram_unit,
            rom: attrs.rom,
            rom_unit: attrs.rom_unit,
            screen_size: attrs.screen_size,
            cpu: attrs.cpu,
            gpu: attrs.gpu,
            os_type: attrs.os_type,
            os_version: attrs.os_version,
            battery_capacity: attrs.battery_capacity,
            connectivity: attrs.connectivity,
            primary_camera: attrs.primary_camera,
            secondary_camera: attrs.secondary_camera,
            display: attrs.display,
            storage: attrs.storage,
            gps_enabled: attrs.gps_enabled === "true",
            refurbished: attrs.refurbished === "true",
            country_of_origin: attrs.country_of_origin
        };
        return item;
    }
};