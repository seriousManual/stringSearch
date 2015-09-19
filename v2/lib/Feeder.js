"use strict";

var splitter = require('./tools/splitter');
var prepareTerm = require('./tools/prepareTerm');
var Chunk = require('./Chunk');
var Subject = require('./Subject');

class Feeder {
    constructor () {
        this._chunks = new Map();
        this._roots = new Set();
    }

    feed (term) {
        var subject = new Subject(term);
        var chunkNames = splitter(prepareTerm(term));
        this._roots.add(chunkNames[0]);

        var prevChunk = null;
        var chunks = [];
        chunkNames.forEach((chunkName) => {
            let currentChunk = this.getCreateChunk(chunkName);
            if (prevChunk) {
                prevChunk.connect(currentChunk, subject);
            }

            prevChunk = currentChunk;

            chunks.push(currentChunk);
        });

        //chunks.forEach((chunk, index) => {
        //    if (chunks[index + 2]) {
        //        chunk.connect(chunks[index + 2]);
        //    }
        //
        //    //TODO: potential
        //    if (chunks[index + 3]) {
        //        chunk.connect(chunks[index + 3]);
        //    }
        //});
    }

    getRoots () {
        return this._roots;
    }

    getChunk (chunkName) {
        return this._chunks.get(chunkName);
    }

    getCreateChunk (chunkName) {
        if (!this._chunks.has(chunkName)) {
            this._chunks.set(chunkName, new Chunk(chunkName));
        }

        return this._chunks.get(chunkName);
    }
}

module.exports = Feeder;