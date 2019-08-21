"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
exports.sequenceReader = (data, offset) => {
    const reader = {};
    const valueKeys = Object.keys(valueReaders);
    const arrayKeys = Object.keys(arrayReaders);
    const stringKeys = Object.keys(stringReaders);
    valueKeys.forEach(key => {
        reader[key] = () => {
            const { bytes, reader } = valueReaders[key];
            const result = reader(data, offset);
            offset += bytes;
            return result;
        };
    });
    arrayKeys.forEach(key => {
        reader[key] = (length) => {
            const { bytes, reader } = arrayReaders[key];
            const result = reader(data, offset, length);
            offset += bytes * length;
            return result;
        };
    });
    stringKeys.forEach(key => {
        reader[key] = (length) => {
            const { bytes, reader } = stringReaders[key];
            const result = reader(data, offset, length);
            offset += bytes * length;
            return result;
        };
    });
    reader.skip = bytes => { offset += bytes; };
    reader.move = newOffset => { offset = newOffset; };
    reader.currentOffset = () => offset;
    reader.getData = () => data;
    return reader;
};
const fixed = {
    bytes: 4,
    reader: _1.readFixed
};
const fixed2_14 = {
    bytes: 2,
    reader: _1.readFixed2_14
};
const int8 = {
    bytes: 1,
    reader: _1.readInt8
};
const int16 = {
    bytes: 2,
    reader: _1.readInt16
};
const int32 = {
    bytes: 4,
    reader: _1.readInt32
};
const uint8 = {
    bytes: 1,
    reader: _1.readUint8
};
const uint16 = {
    bytes: 2,
    reader: _1.readUint16
};
const uint32 = {
    bytes: 4,
    reader: _1.readUint32
};
const uint64 = {
    bytes: 8,
    reader: _1.readUint64
};
const uint8Array = {
    bytes: 1,
    reader: _1.readUint8Array
};
const uint16Array = {
    bytes: 2,
    reader: _1.readUint16Array
};
const ascii = {
    bytes: 1,
    reader: _1.readAscii
};
const valueReaders = {
    fixed,
    fixed2_14,
    int8,
    int16,
    int32,
    uint8,
    uint16,
    uint32,
    uint64
};
const arrayReaders = {
    uint8Array,
    uint16Array
};
const stringReaders = {
    ascii
};
//# sourceMappingURL=sequence-reader.js.map