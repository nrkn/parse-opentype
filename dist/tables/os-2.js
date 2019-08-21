"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binary_readers_1 = require("../binary-readers");
const parse = function (data, offset, length) {
    var ver = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var obj = {};
    if (ver == 0)
        version0(data, offset, obj);
    else if (ver == 1)
        version1(data, offset, obj);
    else if (ver == 2 || ver == 3 || ver == 4)
        version2(data, offset, obj);
    else if (ver == 5)
        version5(data, offset, obj);
    else
        throw "unknown OS/2 table version: " + ver;
    return obj;
};
const version0 = function (data, offset, obj) {
    obj.xAvgCharWidth = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.usWeightClass = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.usWidthClass = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.fsType = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.ySubscriptXSize = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.ySubscriptYSize = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.ySubscriptXOffset = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.ySubscriptYOffset = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.ySuperscriptXSize = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.ySuperscriptYSize = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.ySuperscriptXOffset = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.ySuperscriptYOffset = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.yStrikeoutSize = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.yStrikeoutPosition = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.sFamilyClass = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.panose = binary_readers_1.readUint8Array(data, offset, 10);
    offset += 10;
    obj.ulUnicodeRange1 = binary_readers_1.readUint32(data, offset);
    offset += 4;
    obj.ulUnicodeRange2 = binary_readers_1.readUint32(data, offset);
    offset += 4;
    obj.ulUnicodeRange3 = binary_readers_1.readUint32(data, offset);
    offset += 4;
    obj.ulUnicodeRange4 = binary_readers_1.readUint32(data, offset);
    offset += 4;
    obj.achVendID = [binary_readers_1.readInt8(data, offset), binary_readers_1.readInt8(data, offset + 1), binary_readers_1.readInt8(data, offset + 2), binary_readers_1.readInt8(data, offset + 3)];
    offset += 4;
    obj.fsSelection = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.usFirstCharIndex = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.usLastCharIndex = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.sTypoAscender = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.sTypoDescender = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.sTypoLineGap = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.usWinAscent = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.usWinDescent = binary_readers_1.readUint16(data, offset);
    offset += 2;
    return offset;
};
const version1 = function (data, offset, obj) {
    offset = version0(data, offset, obj);
    obj.ulCodePageRange1 = binary_readers_1.readUint32(data, offset);
    offset += 4;
    obj.ulCodePageRange2 = binary_readers_1.readUint32(data, offset);
    offset += 4;
    return offset;
};
const version2 = function (data, offset, obj) {
    offset = version1(data, offset, obj);
    obj.sxHeight = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.sCapHeight = binary_readers_1.readInt16(data, offset);
    offset += 2;
    obj.usDefault = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.usBreak = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.usMaxContext = binary_readers_1.readUint16(data, offset);
    offset += 2;
    return offset;
};
const version5 = function (data, offset, obj) {
    offset = version2(data, offset, obj);
    obj.usLowerOpticalPointSize = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.usUpperOpticalPointSize = binary_readers_1.readUint16(data, offset);
    offset += 2;
    return offset;
};
exports.OS2 = { parse };
//# sourceMappingURL=os-2.js.map