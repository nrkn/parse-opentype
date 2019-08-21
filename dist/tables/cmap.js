"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binary_readers_1 = require("../binary-readers");
const parse = function (data, offset, length) {
    data = new Uint8Array(data.buffer, offset, length);
    offset = 0;
    var offset0 = offset;
    var obj = {};
    var version = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var numTables = binary_readers_1.readUint16(data, offset);
    offset += 2;
    //console.log(version, numTables);
    var offs = [];
    obj.tables = [];
    for (var i = 0; i < numTables; i++) {
        var platformID = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var encodingID = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var noffset = binary_readers_1.readUint32(data, offset);
        offset += 4;
        var id = "p" + platformID + "e" + encodingID;
        //console.log("cmap subtable", platformID, encodingID, noffset);
        var tind = offs.indexOf(noffset);
        if (tind == -1) {
            tind = obj.tables.length;
            var subt;
            offs.push(noffset);
            var format = binary_readers_1.readUint16(data, noffset);
            if (format == 0)
                subt = parse0(data, noffset);
            else if (format == 4)
                subt = parse4(data, noffset);
            else if (format == 6)
                subt = parse6(data, noffset);
            else if (format == 12)
                subt = parse12(data, noffset);
            else
                console.log("unknown format: " + format, platformID, encodingID, noffset);
            obj.tables.push(subt);
        }
        if (obj[id] != null)
            throw Error("multiple tables for one platform+encoding");
        obj[id] = tind;
    }
    return obj;
};
const parse0 = function (data, offset) {
    var obj = {};
    obj.format = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var len = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var lang = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.map = [];
    for (var i = 0; i < len - 6; i++)
        obj.map.push(data[offset + i]);
    return obj;
};
const parse4 = function (data, offset) {
    var offset0 = offset;
    var obj = {};
    obj.format = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var length = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var language = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var segCountX2 = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var segCount = segCountX2 / 2;
    obj.searchRange = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.entrySelector = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.rangeShift = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.endCount = binary_readers_1.readUint16Array(data, offset, segCount);
    offset += segCount * 2;
    offset += 2;
    obj.startCount = binary_readers_1.readUint16Array(data, offset, segCount);
    offset += segCount * 2;
    obj.idDelta = [];
    for (var i = 0; i < segCount; i++) {
        obj.idDelta.push(binary_readers_1.readInt16(data, offset));
        offset += 2;
    }
    obj.idRangeOffset = binary_readers_1.readUint16Array(data, offset, segCount);
    offset += segCount * 2;
    obj.glyphIdArray = [];
    while (offset < offset0 + length) {
        obj.glyphIdArray.push(binary_readers_1.readUint16(data, offset));
        offset += 2;
    }
    return obj;
};
const parse6 = function (data, offset) {
    var offset0 = offset;
    var obj = {};
    obj.format = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var length = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var language = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.firstCode = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var entryCount = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.glyphIdArray = [];
    for (var i = 0; i < entryCount; i++) {
        obj.glyphIdArray.push(binary_readers_1.readUint16(data, offset));
        offset += 2;
    }
    return obj;
};
const parse12 = function (data, offset) {
    var offset0 = offset;
    var obj = {};
    obj.format = binary_readers_1.readUint16(data, offset);
    offset += 2;
    offset += 2;
    var length = binary_readers_1.readUint32(data, offset);
    offset += 4;
    var lang = binary_readers_1.readUint32(data, offset);
    offset += 4;
    var nGroups = binary_readers_1.readUint32(data, offset);
    offset += 4;
    obj.groups = [];
    for (var i = 0; i < nGroups; i++) {
        var off = offset + i * 12;
        var startCharCode = binary_readers_1.readUint32(data, off + 0);
        var endCharCode = binary_readers_1.readUint32(data, off + 4);
        var startGlyphID = binary_readers_1.readUint32(data, off + 8);
        obj.groups.push([startCharCode, endCharCode, startGlyphID]);
    }
    return obj;
};
exports.cmap = { parse };
//# sourceMappingURL=cmap.js.map