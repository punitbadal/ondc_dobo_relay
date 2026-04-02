function findTag(tags, code) {
    if (!tags) return null;
    for (const tag of tags) {
        if (tag.code === code) return tag.value;
        if (tag.list) {
            const found = tag.list.find(item => item.code === code);
            if (found) return found.value;
        }
    }
    return null;
}

function indexTags(tags) {
    const map = {};
    if (!tags) return map;
    tags.forEach(tag => {
        if (tag.list) {
            tag.list.forEach(item => {
                map[item.code] = item.value;
            });
        }
    });
    return map;
}

module.exports = { findTag, indexTags };