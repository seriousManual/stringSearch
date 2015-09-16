var readline = require('readline');
var fs = require('fs');

var hr = require('hirestime');
var split = require('split');
var through = require('through');

var Index = require('./lib/Index');
var Matcher = require('./lib/Matcher');

var index = new Index();
var matcher = new Matcher(index);

var overallImported = 0;
var importElapsed = hr();
fs
    .createReadStream('./data/productNames.txt')
    .pipe(split())
    .pipe(cutStream(25000))
    .pipe(through(function write(line) {
        var parts = line.split('\t');

        this.emit('data', {
            manufacturer: parts[0],
            model: parts[1],
            artid: parseInt(parts[2], 10)
        });
    }))
    .pipe(through(function write(data) {
        overallImported++;
        (data.manufacturer + ' ' + data.model).split(' ').forEach(function(word) {
            index.feed(word, data);
        });
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
    console.log('====================================================================================');
    console.log('searchTerm: ' + term);
    console.log('-------------------------------------------------');

    term
        .toLowerCase()
        .split(' ').forEach(function(word) {
        console.log('\nmatching for %s', word);

        var elapsedResult = hr();
        var result = matcher.match(word);
        console.log('match took: ' + elapsedResult());

        var evalResult = hr();
        var evald = result.calculate();
        console.log('eval took: ' + evalResult());

        console.log('overall %d results of varying quality', evald.length);
        console.log(evald);
    });
}

function cutStream(number) {
    var i = 0;

    return through(function write(entry) {
        if (i++ < number) {
            this.emit('data', entry);
        }
    });
}