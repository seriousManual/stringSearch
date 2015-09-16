function prepareTerm(term, op) {
    term = term.toLowerCase();
    term = term.replace(/\s/g, '');

    var parts = op(term);
    //parts.sort();

    return parts;
}

module.exports = prepareTerm;