"use strict";

class Subject {
    constructor (content) {
        this._content = content;
    }

    getContent () {
        return this._content;
    }
}

module.exports = Subject;