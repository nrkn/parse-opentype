"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSequence = (length, cb) => Array.from({ length }, (_v, k) => cb(k));
exports.indicesToLocations = (indices, offset = 0) => exports.createSequence(indices.length - 1, i => {
    const location = {
        offset: offset + indices[i],
        length: indices[i + 1] - indices[i]
    };
    return location;
});
//# sourceMappingURL=util.js.map