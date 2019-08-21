"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
exports.readFixed = (data, offset) => ((data[offset] << 8) | data[offset + 1]) +
    (((data[offset + 2] << 8) | data[offset + 3]) / (256 * 256 + 4));
exports.readFixed2_14 = (data, offset) => exports.readInt16(data, offset) / 16384;
exports.readInt8 = (data, offset) => {
    uint8[0] = data[offset];
    return int8[0];
};
exports.readUint8 = (data, offset) => data[offset];
exports.readInt16 = (data, offset) => {
    uint8[0] = data[offset + 1];
    uint8[1] = data[offset];
    return int16[0];
};
exports.readInt32 = (data, offset) => {
    uint8[0] = data[offset + 3];
    uint8[1] = data[offset + 2];
    uint8[2] = data[offset + 1];
    uint8[3] = data[offset];
    return int32[0];
};
exports.readUint16 = (data, offset) => (data[offset] << 8) | data[offset + 1];
exports.readUint32 = (data, offset) => {
    uint8[0] = data[offset + 3];
    uint8[1] = data[offset + 2];
    uint8[2] = data[offset + 1];
    uint8[3] = data[offset];
    return uint32[0];
};
exports.readUint64 = (data, offset) => exports.readUint32(data, offset) * (0xffffffff + 1) + exports.readUint32(data, offset + 4);
exports.readUint8Array = (data, offset, length) => util_1.createSequence(length, i => data[offset + i]);
exports.readUint16Array = (data, offset, length) => util_1.createSequence(length, i => exports.readUint16(data, i * 2 + offset));
exports.readAscii = (data, offset, length) => util_1.createSequence(length, i => String.fromCharCode(data[offset + i])).join('');
exports.readUnicode = (data, offset, length) => util_1.createSequence(length, () => String.fromCharCode((data[offset++] << 8) | data[offset++])).join('');
let textDecoder;
if (typeof window !== 'undefined' && window.TextDecoder) {
    textDecoder = new window.TextDecoder();
}
exports.readUtf8 = (data, offset, length) => {
    if (textDecoder && offset === 0 && length === data.length) {
        return textDecoder['decode'](data);
    }
    return exports.readAscii(data, offset, length);
};
exports.readAsciiArray = (data, offset, length) => util_1.createSequence(length, i => String.fromCharCode(data[offset + i]));
const buff = new ArrayBuffer(8);
const int8 = new Int8Array(buff);
const uint8 = new Uint8Array(buff);
const int16 = new Int16Array(buff);
const int32 = new Int32Array(buff);
const uint32 = new Uint32Array(buff);
//# sourceMappingURL=index.js.map