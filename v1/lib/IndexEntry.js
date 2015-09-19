function IndexEntry(term, confidence) {
    this._term = term;
    this._confidence = confidence;
}

IndexEntry.prototype.getTerm = function() {
    return this._term;
};

IndexEntry.prototype.getConfidence = function() {
    return this._confidence;
};

module.exports = IndexEntry;