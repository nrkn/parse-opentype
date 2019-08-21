"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequence_reader_1 = require("../binary-readers/sequence-reader");
const parse = (data, offset) => {
    const { int16, uint16, skip } = sequence_reader_1.sequenceReader(data, offset);
    // tableVersion, fixed
    skip(4);
    const ascender = int16();
    const descender = int16();
    const lineGap = int16();
    const advanceWidthMax = uint16();
    const minLeftSideBearing = int16();
    const minRightSideBearing = int16();
    const xMaxExtent = int16();
    const caretSlopeRise = int16();
    const caretSlopeRun = int16();
    const caretOffset = int16();
    // not specified in original code, but 2 * 4 byte entries
    skip(8);
    const metricDataFormat = int16();
    const numberOfHMetrics = uint16();
    return {
        ascender, descender, lineGap, advanceWidthMax, minLeftSideBearing,
        minRightSideBearing, xMaxExtent, caretSlopeRise, caretSlopeRun, caretOffset,
        metricDataFormat, numberOfHMetrics
    };
};
exports.hhea = { parse };
//# sourceMappingURL=hhea.js.map