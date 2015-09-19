function splitter(identifier, size) {
    size = size || 2;

    var parts = identifier.split('');

    var resultList = [];
    for (var i = 0; i < parts.length; i++) {
        if (i + size <= parts.length) {
            var subPart = '';
            for (var x = i; x < (i + size); x++) {
                subPart += parts[x];
            }
            resultList.push(subPart);
        }
    }

    return resultList;
}

module.exports = splitter;