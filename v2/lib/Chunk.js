"use strict";

var Connection = require('./Connection');

var numConnections = 0;

class Chunk {
    constructor (name) {
        this._name = name;
        this._connections = new Map();
    }

    connect (chunk, subject) {
        var connection;
        var chunkName = chunk.getChunkName();
        if (!this._connections.has(chunkName)) {
            connection = new Connection(chunk);
            this._connections.set(chunkName, connection);
        } else {
            connection = this._connections.get(chunkName);
        }

        connection.addSubject(subject);
    }

    getConnections () {
        return this._connections;
    }

    getChunkName () {
        return this._name;
    }
}

module.exports = Chunk;