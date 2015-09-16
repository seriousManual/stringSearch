var create = require('./tools/createIndexEntries');
var IndexEntry = require('./IndexEntry');

function Index() {
    this._index = {};
}

Index.prototype.feed = function(inputTerm, reference) {
    var that = this;
    var searchTermWords = create(inputTerm);

    var lengthBiggestIndexEntry  = searchTermWords.reduce(function(carry, value) {
        return value.length > carry ? value.length : carry;
    }, 0);

    searchTermWords.forEach(function(indexEntry) {
        if (!that._index[indexEntry]) {
            that._index[indexEntry] = [];
        }

        that._index[indexEntry].push(new IndexEntry(inputTerm, indexEntry.length / lengthBiggestIndexEntry));
    });
};

Index.prototype.getSubMatchesBySubTerm = function(subSearchTerm) {
    return !!this._index[subSearchTerm] ? this._index[subSearchTerm] : null;
};

module.exports = Index;