var repl = require("repl");
var fs = require('fs');

var hr = require('hirestime');
var split = require('split');
var through = require('through');

var Index = require('./lib/Index');
var Matcher = require('./lib/Matcher');

var modelIndex = new Index();
var modelMatcher = new Matcher(modelIndex);

var overallImported = 0;
var importElapsed = hr();
fs
    .createReadStream('./data/productNames.txt')
    .pipe(split())
    .pipe(through(function write(line) {
        var parts = line.split('\t');

        this.emit('data', {
            manufacturer: parts[0],
            model: parts[1],
            artid: parseInt(parts[2], 10)
        });
    }))
    .pipe(cutStream(1000))
    .pipe(through(function write(data) {
        overallImported++;
        modelIndex.feed(data.manufacturer + ' ' + data.model);
    }, function() {
        console.log('index took %d ms', importElapsed(hr.MS));
        console.log('imported %d entries', overallImported);

        var replServer = repl.start({
            prompt: 'sweetSearch > '
        });

        replServer.context.match = match;
    }));

function match(term) {
    console.log('searchTerm: ' + term);
    var elapsedResult = hr();
    var result = modelMatcher.match(term);
    console.log('match took: ' + elapsedResult());

    var elapsedEval = hr();
    var evald = result.calculate();
    console.log('eval took: ' + elapsedEval());

    console.log(evald);
    console.log('-------------------------------------------------');
}

function cutStream(number) {
    var i = 0;

    return through(function write(entry) {
        if (i++ < number) {
            this.emit('data', entry);
        }
    });
}