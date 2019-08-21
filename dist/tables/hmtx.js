"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binary_readers_1 = require("../binary-readers");
const parse = function (data, offset, length, font) {
    var obj = {};
    obj.aWidth = [];
    obj.lsBearing = [];
    var aw = 0, lsb = 0;
    for (var i = 0; i < font.maxp.numGlyphs; i++) {
        if (i < font.hhea.numberOfHMetrics) {
            aw = binary_readers_1.readUint16(data, offset);
            offset += 2;
            lsb = binary_readers_1.readInt16(data, offset);
            offset += 2;
        }
        obj.aWidth.push(aw);
        obj.lsBearing.push(lsb);
    }
    return obj;
};
exports.hmtx = { parse };
//# sourceMappingURL=hmtx.js.map