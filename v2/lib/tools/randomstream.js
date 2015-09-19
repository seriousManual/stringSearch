var through = require('through');

function cutStream(perc) {
    return through(function write(entry) {
        if (Math.random() < perc) {
            this.emit('data', entry);
        }
    });
}

module.exports = cutStream;