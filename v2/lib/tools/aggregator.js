"use strict";

class Aggregator {
    constructor () {
        this._aggregate = new Map();
    }

    add (value, amount) {
        amount = amount || 1;
        var prevNumber = this._aggregate.get(value);

        if (prevNumber === undefined) {
            this._aggregate.set(value, amount);
        } else {
            this._aggregate.set(value, prevNumber + amount);
        }
    }

    addAggregate(aggregate) {
        aggregate.getAggregate().forEach((value, key) => {
            this._aggregate.set(key, value);
        });
    }

    getAggregate () {
        return this._aggregate;
    }
}

module.exports = Aggregator;