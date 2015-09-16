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
    var biggestHitCount = this.getBiggestHitCount();
    var biggestConfidence = this.getBiggestConfidence();

    var filteredEntries = this._entries
        .filter(function(entry) {
            return entry.getHitCount() > biggestHitCount * 0.1;
        });

    filteredEntries.sort(function(a, b) {
        var percConfidenceA = a.getBiggestConfidence() / biggestConfidence;
        var percConfidenceB = b.getBiggestConfidence() / biggestConfidence;

        var percHitCountA = a.getHitCount() / biggestHitCount;
        var percHitCountB = b.getHitCount() / biggestHitCount;

        var pointsA = percConfidenceA * 1 + percHitCountA * 2;
        var pointsB = percConfidenceB * 1 + percHitCountB * 2;

        return pointsB - pointsA;
    });

    return filteredEntries
        .map(function(entry) {
            return entry.getTerm() + '_' + entry.getHitCount() + '_' + entry.getBiggestConfidence();
        });
};

Searchresult.prototype.getBiggestConfidence = function() {
    return this._entries.reduce(function(carry, entry) {
        return entry.getBiggestConfidence() > carry ? entry.getBiggestConfidence() : carry;
    }, 0);
};

Searchresult.prototype.getBiggestHitCount = function() {
    return this._entries.reduce(function(carry, entry) {
        return entry.getHitCount() > carry ? entry.getHitCount() : carry;
    }, 0);
};

Searchresult.prototype.getNumber = function() {
    return this._entries.length;
};

module.exports = Searchresult;