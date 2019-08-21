"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binary_readers_1 = require("../binary-readers");
const parse = function (data, offset, length, font) {
    var obj = [];
    var ver = font.head.indexToLocFormat;
    var len = font.maxp.numGlyphs + 1;
    if (ver == 0)
        for (var i = 0; i < len; i++)
            obj.push(binary_readers_1.readUint16(data, offset + (i << 1)) << 1);
    if (ver == 1)
        for (var i = 0; i < len; i++)
            obj.push(binary_readers_1.readUint32(data, offset + (i << 2)));
    return obj;
};
exports.loca = { parse };
//# sourceMappingURL=loca.js.map