var create = require('./tools/createIndexEntries');
var SearchResult = require('./SearchResult');

function Matcher(index) {
    this._index = index;
}

Matcher.prototype.match = function(searchterm) {
    var that = this;
    var searchTermWords = create(searchterm);

    var overallPossibleSubMatches = 0;
    return searchTermWords
        .map(function(subSearchTerm) {
            return that._index.getSubMatchesBySubTerm(subSearchTerm);
        })
        .reduce(function(carry, subMatches) {
            if (subMatches) {
                subMatches.forEach(function(subMatch) {
                    overallPossibleSubMatches++;
                    carry.addEntry(subMatch);
                });
            }

            return carry;
        }, new SearchResult());
};

module.exports = Matcher;