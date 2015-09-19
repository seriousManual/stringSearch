var through = require('through');

function cutStream(number) {
    var i = 0;

    var stream = through(function write(entry) {
        if (i++ < number) {
            this.emit('data', entry);
        } else {
            stream.end();
        }
    });

    return stream;
}

module.exports = cutStream;