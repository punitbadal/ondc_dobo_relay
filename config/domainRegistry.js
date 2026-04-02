const registry = {
    "ONDC:RET10": { label: "Grocery", core_version: "1.2.0", search_strategy: "by_city_and_category", normalizer: require('../domains/RET10') },
    "ONDC:RET11": { label: "F&B", core_version: "1.2.0", search_strategy: "by_city_only", normalizer: require('../domains/RET11') },
    "ONDC:RET12": { label: "Fashion", core_version: "1.2.0", search_strategy: "by_city_and_category", normalizer: require('../domains/RET12') },
    "ONDC:RET13": { label: "BPC", core_version: "1.2.0", search_strategy: "by_city_and_category", normalizer: require('../domains/RET13') },
    "ONDC:RET14": { label: "Electronics", core_version: "1.2.0", search_strategy: "by_city_and_category", normalizer: require('../domains/RET14') },
    "ONDC:RET15": { label: "Home & Kitchen", core_version: "1.2.0", search_strategy: "by_city_and_category", normalizer: require('../domains/RET15') },
    "ONDC:RET16": { label: "Health & Wellness", core_version: "1.2.0", search_strategy: "by_city_and_category", normalizer: require('../domains/RET16') },
    "ONDC:RET17": { label: "Agriculture", core_version: "1.2.0", search_strategy: "by_city_and_category", normalizer: require('../domains/RET17') }
};

module.exports = {
    get(domain) {
        const config = registry[domain];
        if (!config) throw new Error(`Unsupported domain: ${domain}`);
        return config;
    },
    getAll() { return Object.keys(registry); }
};