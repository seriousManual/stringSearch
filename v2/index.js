"use strict";

var readline = require('readline');
var fs = require('fs');

var hr = require('hirestime');
var split = require('split');
var through = require('through');

var cutStream = require('./lib/tools/cutstream');
var randomstream = require('./lib/tools/randomstream');
var Feeder = require('./lib/Feeder');
var Printer = require('./lib/Printer');
var Matcher = require('./lib/Matcher');

var feeder = new Feeder();
var matcher = new Matcher(feeder);

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
    .pipe(through(function write(data) {
        overallImported++;
        feeder.feed(data.manufacturer + ' ' + data.model);
    }, function() {
        console.log('----------------------------------------------');
        console.log('index took %d ms', importElapsed(hr.MS));
        console.log('imported %d entries', overallImported);

        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on('line', function (cmd) {
            console.log('###################################################################');
            var elapsed = hr();
            var match = matcher.match(cmd);
            console.log('took me %d ms', elapsed());

            var aggregate = match.getAggregate();
            console.log('----------------------------');
            console.log('%d results', aggregate.size);

            var aetz = hr();
            var collect = [];
            aggregate.forEach((value, key) => {
                collect.push([key, value]);
            });
            
            if (collect.length > 0) {
                collect.sort(function(a, b) {
                    if (a[1] == b[1]) return 0;
    
                    return b[1] - a[1];
                });
                var biggestCollect = collect[0][1];
    
                collect = collect.filter((item) => item[1] > biggestCollect * 0.7);
            } else {
                console.log('keine ergebnisse :(');
            }
            console.log('aetz took %dms', aetz());
            console.log('%d results, filtered', collect.length);
            console.log('result: ', collect.slice(0, 10));
        });
    }));
