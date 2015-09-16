function SearchresultEntry(term) {
    this._term = term;
    this._confidences = [];
}

SearchresultEntry.prototype.getTerm = function() {
    return this._term;
};

SearchresultEntry.prototype.addConfidence = function(confidence) {
    this._confidences.push(confidence);
};

SearchresultEntry.prototype.getHitCount = function() {
    return this._confidences.length;
};

SearchresultEntry.prototype.getBiggestConfidence = function() {
    return this._confidences.reduce(function(carry, value) {
        return value > carry ? value : carry;
    }, 0);
};

SearchresultEntry.prototype.getAvgConfidence = function() {
    return this._confidences.reduce(function(carry, value) {
            return carry + value;
        }, 0) / this._confidences.length;
};

module.exports = SearchresultEntry;