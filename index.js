var readline = require('readline');
var fs = require('fs');

var hr = require('hirestime');
var split = require('split');
var through = require('through');

var Index = require('./lib/Index');
var Matcher = require('./lib/Matcher');

var modelIndex = new Index();
var modelMatcher = new Matcher(modelIndex);

var manufIndex = new Index();
var manufMatcher = new Matcher(manufIndex);

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
    .pipe(cutStream(10000))
    .pipe(through(function write(data) {
        overallImported++;
        modelIndex.feed(data.model, data);
        manufIndex.feed(data.manufacturer, data);
    }, function() {
        console.log('index took %d ms', importElapsed(hr.MS));
        console.log('imported %d entries', overallImported);

        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on('line', function (cmd) {
            match(cmd);
        });
    }));

function match(term) {
    console.log('searchTerm: ' + term);
    console.log('-------------------------------------------------');

    var elapsedManufResult = hr();
    var manufResult = manufMatcher.match(term);
    var manufEvaled = manufResult.calculate();
    console.log('manufMatch took: ' + elapsedManufResult());

    var elapsedModelResult = hr();
    var modelResult = modelMatcher.match(term);
    var modelEvaled = modelResult.calculate();
    console.log('modelMatch took: ' + elapsedModelResult());

    console.log(manufEvaled);
    console.log(modelEvaled);
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