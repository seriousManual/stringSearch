"use strict";

var ChunkIterator = require('./ChunkIterator');

var Aggregator = require('./tools/Aggregator');
var splitter = require('./tools/splitter');
var unsplitter = require('./tools/unsplitter');
var prepareTerm = require('./tools/prepareTerm');

class Matcher {

    constructor (feeder) {
        this._feeder = feeder;
    }

    match (term) {
        var chunkNames = splitter(prepareTerm(term));

        var aggregator = new Aggregator();
        for (var i = 0; i < chunkNames.length; i++) {
            aggregator.addAggregate(this._subMatch(chunkNames.slice(i)));

            break;
        }

        return aggregator;
    }

    _subMatch(chunkNames) {
        var iterator = new ChunkIterator(this._feeder);

        var subjects = new Aggregator();
        while (true) {
            let chunkName = chunkNames.shift();
            let queryResult = iterator.query(chunkName);
            let intermediateChunk = queryResult[0];
            let intermediateSubjects = queryResult[1];

            if (intermediateSubjects) {
                intermediateSubjects.forEach((subject) => {
                    subjects.add(subject);
                });
            }

            if (!intermediateChunk) {
                break;
            }
        }

        return subjects;
    }

    _rework(result, tmpResult) {
        if (tmpResult.length == 0) {
            return null;
        }

        tmpResult = unsplitter(tmpResult);

        if (result.length == 0) {
            return tmpResult;
        }

        var latestOne = result[result.length - 1];
        if (!latestOne.includes(tmpResult)) {
            return tmpResult;
        }

        return null;
    }
}

module.exports = Matcher;