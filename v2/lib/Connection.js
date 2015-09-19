"use strict";

class Connection {
    constructor (partnerChunk) {
        this._partnerChunk = partnerChunk;
        this._subjects = [];
    }

    getPartnerChunk () {
        return this._partnerChunk;
    }

    getSubjects() {
        return this._subjects;
    }

    addSubject (subject) {
        this._subjects.push(subject);
    }
}

module.exports = Connection;