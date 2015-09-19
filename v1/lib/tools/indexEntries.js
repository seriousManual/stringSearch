function indexEntries(permutations) {
    return permutations.map(function(list) {
        return list.join('');
    });
}

module.exports = indexEntries;