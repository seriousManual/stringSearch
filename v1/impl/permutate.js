var hirestime = require('hirestime');

var permutator = require('./../permutator');

for(var i = 0; i < 10; i++) {
    var list = randomList();
    var elapsed = hirestime();
    var res = permutator(list);
    console.log(elapsed(hirestime.MS));

    console.log(res);
}

function randomList() {
    return (new Array(5)
        .join('-')
        .split('-')
        .map(function() {
            return parseInt(Math.random() * 1000, 10);
        }));
}