"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequence_reader_1 = require("../binary-readers/sequence-reader");
const parse = (data, offset) => {
    const { fixed, uint32, uint16, uint64, int16 } = sequence_reader_1.sequenceReader(data, offset);
    const tableVersion = fixed();
    const fontRevision = fixed();
    const checkSumAdjustment = uint32();
    const magicNumber = uint32();
    const flags = uint16();
    const unitsPerEm = uint16();
    const created = uint64();
    const modified = uint64();
    const xMin = int16();
    const yMin = int16();
    const xMax = int16();
    const yMax = int16();
    const macStyle = uint16();
    const lowestRecPPEM = uint16();
    const fontDirectionHint = int16();
    const indexToLocFormat = int16();
    const glyphDataFormat = int16();
    return {
        tableVersion, fontRevision, checkSumAdjustment, magicNumber, flags,
        unitsPerEm, created, modified, xMin, yMin, xMax, yMax, macStyle,
        lowestRecPPEM, fontDirectionHint, indexToLocFormat,
        glyphDataFormat
    };
};
exports.head = { parse };
//# sourceMappingURL=head.js.map