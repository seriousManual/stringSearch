var prep = require('./prepareTerm');
var splitter = require('./splitter');
var permutator = require('./permutator');
var entries = require('./indexEntries');

function createIndexEntries(term) {
    var parts = prep(term, splitter);
    var permutated = permutator(parts);
    var indexTerms = entries(permutated);

    return indexTerms;
    return indexTerms.filter(function(indexEntry) {
        return indexEntry.length >= term.length * 0.5;
    });
}

module.exports = createIndexEntries;