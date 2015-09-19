var hr = require('hirestime');

var splitter = require('../lib/tools/splitter');

function work(term) {
    term = term.toLowerCase();
    term = term.replace(/\s/g, '');

    var parts = splitter(term, 2);

    return parts;
}

//console.log(work('byzance'));
//console.log(work('bizanz'));
//console.log(work('bizance'));
//console.log(work('bycanz'));


var set1 = work('22" byzance heavy ride');
var set2 = work('heavy ride');
console.log(set2);

var intersection = set1.filter(function(chunk) {
    return set2.indexOf(chunk) != -1;
});

console.log(intersection);