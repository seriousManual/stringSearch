"use strict";

class ChunkIterator {
    constructor (feeder) {
        this._feeder = feeder;
        this._currentChunk = null;
    }

    query (chunkName) {
        var tmpChunk = null;
        var subjects = null;
        if (!this._currentChunk) {
            tmpChunk = this._feeder.getChunk(chunkName);
        } else if (this._currentChunk.getConnections().has(chunkName)) {
            var connection = this._currentChunk.getConnections().get(chunkName);
            tmpChunk = connection.getPartnerChunk();
            subjects = connection.getSubjects();
        }

        this._currentChunk = tmpChunk;

        return [tmpChunk, subjects];
    }
}

module.exports = ChunkIterator;