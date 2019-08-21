"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binary_readers_1 = require("../binary-readers");
const parse = function (data, offset, length) {
    var obj = {};
    obj.version = binary_readers_1.readFixed(data, offset);
    offset += 4;
    obj.italicAngle = binary_readers_1.readFixed(data, offset);
    offset += 4;
    obj.underlinePosition = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.underlineThickness = binary_readers_1.readInt16(data, offset);
    offset += 2;
    return obj;
};
exports.post = { parse };
//# sourceMappingURL=post.js.map