var SearchresultEntry = require('./SearchResultEntry');

function Searchresult() {
    this._entriesLookup = {};
    this._entries = [];
}

Searchresult.prototype.addEntry = function(entry) {
    if (!this._entriesLookup[entry.getTerm()]) {
        var searchResultEntry = new SearchresultEntry(entry.getTerm());
        this._entriesLookup[entry.getTerm()] = searchResultEntry;
        this._entries.push(searchResultEntry);
    }

    this._entriesLookup[entry.getTerm()].addConfidence(entry.getConfidence());
};

Searchresult.prototype.calculate = function() {
    this._entries.sort(function(a, b) {
        return b.getHitCount() - a.getHitCount();
    });

    return this._entries
        .slice(0, 10)
        .map(function(entry) {
            return entry.getTerm() + ' ' + entry.getHitCount() + ' ' + entry.getBiggestConfidence();
        });
};

module.exports = Searchresult;