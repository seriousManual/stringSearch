var through = require('through');

function cutStream(number) {
    var i = 0;

    return through(function write(entry) {
        if (i++ < number) {
            this.emit('data', entry);
        }
    });
}

module.exports = cutStream;