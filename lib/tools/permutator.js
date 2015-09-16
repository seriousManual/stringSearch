function permutator(list) {
    var res = [];
    for (var i = 0; i < list.length; i++) {
        var carry2 = [];

        for (var x = i; x < list.length; x++) {
            carry2.push(list[x]);

            res = res.concat([[].concat(carry2)]);
        }
    }

    return res;
}

module.exports = permutator;