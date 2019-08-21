"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binary_readers_1 = require("../binary-readers");
const parse = function (data, offset, length, font) {
    var version = binary_readers_1.readUint16(data, offset);
    offset += 2;
    if (version == 1)
        return parseV1(data, offset - 2, length, font);
    var nTables = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var map = { glyph1: [], rval: [] };
    for (var i = 0; i < nTables; i++) {
        offset += 2; // skip version
        var length = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var coverage = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var format = coverage >>> 8;
        /* I have seen format 128 once, that's why I do */ format &= 0xf;
        if (format == 0)
            offset = readFormat0(data, offset, map);
        else
            throw "unknown kern table format: " + format;
    }
    return map;
};
const parseV1 = function (data, offset, length, font) {
    var version = binary_readers_1.readFixed(data, offset);
    offset += 4;
    var nTables = binary_readers_1.readUint32(data, offset);
    offset += 4;
    var map = { glyph1: [], rval: [] };
    for (var i = 0; i < nTables; i++) {
        var length = binary_readers_1.readUint32(data, offset);
        offset += 4;
        var coverage = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var tupleIndex = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var format = coverage >>> 8;
        /* I have seen format 128 once, that's why I do */ format &= 0xf;
        if (format == 0)
            offset = readFormat0(data, offset, map);
        else
            throw "unknown kern table format: " + format;
    }
    return map;
};
const readFormat0 = function (data, offset, map) {
    var pleft = -1;
    var nPairs = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var searchRange = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var entrySelector = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var rangeShift = binary_readers_1.readUint16(data, offset);
    offset += 2;
    for (var j = 0; j < nPairs; j++) {
        var left = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var right = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var value = binary_readers_1.readInt16(data, offset);
        offset += 2;
        if (left != pleft) {
            map.glyph1.push(left);
            map.rval.push({ glyph2: [], vals: [] });
        }
        var rval = map.rval[map.rval.length - 1];
        rval.glyph2.push(right);
        rval.vals.push(value);
        pleft = left;
    }
    return offset;
};
exports.kern = { parse };
//# sourceMappingURL=kern.js.map