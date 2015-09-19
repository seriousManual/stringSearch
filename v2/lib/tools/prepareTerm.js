function prepareTerm(term) {
    return term
        .toLowerCase()
        .replace(/\s+/g, '');
}

module.exports = prepareTerm;