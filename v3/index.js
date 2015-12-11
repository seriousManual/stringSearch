var fs = require('fs')

var readline = require('readline')
var hr = require('hirestime')
var through = require('through')
var split = require('split')

var cutstream = require('./lib/tools/cutstream')
var splitter = require('./lib/tools/splitter')

var Subject = require('./lib/Subject')

var subjects = new Map();
var chunks = new Map();
var globalMap = new Map();

var elapsedIndex = hr()

fs
    .createReadStream('./data/productNames.txt')
    .pipe(split())
//    .pipe(cutstream(20000))
    .pipe(through(function write(line) {
        var parts = line.split('\t');

        this.emit('data', {
            manufacturer: parts[0],
            model: parts[1],
            artid: parseInt(parts[2], 10)
        });
    }))
    .pipe(through(function write(product) {
        var sourceTerm = (product.manufacturer + ' ' + product.model)
        var term = prepareTerm(sourceTerm)

        if (!subjects.has(term)) {
            subjects.set(term, new Subject(sourceTerm))
        }
        var subject = subjects.get(term)

        splitter(term, 3).forEach((snippet) => {
            if (!chunks.has(snippet)) {
                chunks.set(snippet, new Subject(snippet))
            }
            var chunk = chunks.get(snippet)

            this.emit('data', {
                chunk: chunk,
                subject: subject
            })
        })
    }))
    .pipe(through(function write(data) {
        if (!globalMap.has(data.chunk)) {
            globalMap.set(data.chunk, new Set())
        }

        globalMap.get(data.chunk).add(data.subject)
    }))
    .on('end', () => {
        console.log('indexed %d items in %dms', subjects.size, elapsedIndex());
        setupRepl(lineHandler)
    })

function setupRepl(lineHandler) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', lineHandler);
}

function lineHandler(line) {
    console.log('------------------ %s ------------------', line);

    var selectionElapsed = hr();
    var biggest = 0;
    var resultMap = new Map();
    splitter(prepareTerm(line), 3)
        .forEach((snippet) => {
            var chunk = chunks.get(snippet);
            if (!chunk) return;

            var subResult = globalMap.get(chunk);
            if (!subResult) return;

            subResult.forEach((subResultEntry) => {
                var e = resultMap.get(subResultEntry) || 0
                var newE = e+1;
                resultMap.set(subResultEntry, newE)
                biggest = newE > biggest ? newE : biggest
            })
        })
    var selectionElapsedTime = selectionElapsed();

    var iterationElapsed = hr()
    var threshold = 0.8 * biggest;
    var result = []
    resultMap.forEach((count, index) => {
        if (count > threshold) {
            result[count] = result[count] || []
            result[count].push(index)
        }
    })
    var iterationElapsedTime = iterationElapsed();

    var iteratedResult = []
    var maxResultCount = 30
    for(var i = result.length - 1; i >= 0; i--) {
        if (result[i]) {
            console.log(i);
            console.log(result[i].length);
            iteratedResult = iteratedResult.concat(result[i].slice(0, maxResultCount - iteratedResult.length))
            if (iteratedResult.length >= maxResultCount) break
        }
    }

    console.log('selection time: %dms', selectionElapsedTime)
    console.log('iteration time: %dms', iterationElapsedTime)

    console.log(iteratedResult);
}

function prepareTerm(term) {
    return term
        .replace(/[^a-zA-Z0-9äöüÖÄÜ]/g, '')
        .toLowerCase()
}