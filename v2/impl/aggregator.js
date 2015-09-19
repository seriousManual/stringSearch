var Aggregator = require('./../lib/tools/Aggregator');

var a = new Aggregator();

var x = {a: 'b'};
var y = {b: 'c'};

a.add(x);
a.add(x);
a.add(y);

console.log(a);