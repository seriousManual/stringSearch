"use strict";

class Printer {
    constructor (feeder) {
        this._feeder = feeder;
    }

    output () {
        var result = [];
        var roots = this._feeder.getRoots();
        for (var root of roots.values()) {
            result = this._outputNode(result, this._feeder.getChunk(root), 0)
        }

        return result;
    }

    _outputNode (carry, node, depth) {
        if (depth > 100) {
            throw new Error('ups');
        }

        carry.push(' ' . repeat(depth * 3) + node.getChunkName());
        for (var entry of node.getConnections().entries()) {
            let key = entry[0];
            let childNode = entry[1];

            carry = this._outputNode(carry, childNode, depth + 1);
        }

        return carry;
    }
}

module.exports = Printer;