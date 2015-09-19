var hr = require('hirestime');

var Index = require('../lib/Index');
var Matcher = require('../lib/Matcher');

var terms = [
    'pearl braten',
    'tama foo mit bar braten',
    '22" meinl byzance heavy ride',
    '20" meinl byzance heavy ride',
    'meinl 20" HCS ride',
    'meinl 22" Byzance vintage Pur light',
    'paiste 20" heavy ride'
];

var searchterm = 'meinl 22" byzance vintage pur light';

var index = new Index();
var matcher = new Matcher(index);
terms.forEach(index.feed.bind(index));

for (var i = 0; i < 10; i++) {
    var elapsed = hr();
    var searchResult = matcher.match(searchterm);
    console.log('took: ' + elapsed(hr.MS) + 'ms');

    console.log(searchResult.calculate());
}
