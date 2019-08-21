"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binary_readers_1 = require("../binary-readers");
const parse = function (data, offset, length) {
    var obj = {};
    // both versions 0.5 and 1.0
    var ver = binary_readers_1.readUint32(data, offset);
    offset += 4;
    obj.numGlyphs = binary_readers_1.readUint16(data, offset);
    offset += 2;
    // only 1.0
    if (ver == 0x00010000) {
        obj.maxPoints = binary_readers_1.readUint16(data, offset);
        offset += 2;
        obj.maxContours = binary_readers_1.readUint16(data, offset);
        offset += 2;
        obj.maxCompositePoints = binary_readers_1.readUint16(data, offset);
        offset += 2;
        obj.maxCompositeContours = binary_readers_1.readUint16(data, offset);
        offset += 2;
        obj.maxZones = binary_readers_1.readUint16(data, offset);
        offset += 2;
        obj.maxTwilightPoints = binary_readers_1.readUint16(data, offset);
        offset += 2;
        obj.maxStorage = binary_readers_1.readUint16(data, offset);
        offset += 2;
        obj.maxFunctionDefs = binary_readers_1.readUint16(data, offset);
        offset += 2;
        obj.maxInstructionDefs = binary_readers_1.readUint16(data, offset);
        offset += 2;
        obj.maxStackElements = binary_readers_1.readUint16(data, offset);
        offset += 2;
        obj.maxSizeOfInstructions = binary_readers_1.readUint16(data, offset);
        offset += 2;
        obj.maxComponentElements = binary_readers_1.readUint16(data, offset);
        offset += 2;
        obj.maxComponentDepth = binary_readers_1.readUint16(data, offset);
        offset += 2;
    }
    return obj;
};
exports.maxp = { parse };
//# sourceMappingURL=maxp.js.map