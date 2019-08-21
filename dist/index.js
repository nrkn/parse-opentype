"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binary_readers_1 = require("./binary-readers");
const tables_1 = require("./tables");
const util_1 = require("./util");
exports.parseOpenType = (buff) => {
    const data = new Uint8Array(buff);
    const tag = binary_readers_1.readAscii(data, 0, 4);
    if (tag === "ttcf") {
        let offset = 4;
        const majV = binary_readers_1.readUint16(data, offset);
        offset += 2;
        const minV = binary_readers_1.readUint16(data, offset);
        offset += 2;
        const fontCount = binary_readers_1.readUint32(data, offset);
        offset += 4;
        const fonts = util_1.createSequence(fontCount, () => {
            const fontOffset = binary_readers_1.readUint32(data, offset);
            offset += 4;
            return readFont(data, fontOffset);
        });
        return fonts;
    }
    else {
        return [readFont(data, 0)];
    }
};
const readFont = (data, offset) => {
    const originalOffset = offset;
    const sfnt_version = binary_readers_1.readFixed(data, offset);
    offset += 4;
    const numTables = binary_readers_1.readUint16(data, offset);
    offset += 2;
    const searchRange = binary_readers_1.readUint16(data, offset);
    offset += 2;
    const entrySelector = binary_readers_1.readUint16(data, offset);
    offset += 2;
    const rangeShift = binary_readers_1.readUint16(data, offset);
    offset += 2;
    const tags = [
        'cmap',
        'head',
        'hhea',
        'maxp',
        'hmtx',
        'name',
        'OS/2',
        'post',
        //'cvt',
        //'fpgm',
        'loca',
        'glyf',
        'kern',
        //'prep'
        //'gasp'
        'CFF ',
        'GPOS',
        'GSUB',
        'SVG '
        //'VORG',
    ];
    const fontData = { _data: data, _offset: originalOffset };
    const font = {};
    const tabs = {};
    for (var i = 0; i < numTables; i++) {
        var tag = binary_readers_1.readAscii(data, offset, 4);
        offset += 4;
        var checkSum = binary_readers_1.readUint32(data, offset);
        offset += 4;
        var toffset = binary_readers_1.readUint32(data, offset);
        offset += 4;
        var length = binary_readers_1.readUint32(data, offset);
        offset += 4;
        tabs[tag] = { offset: toffset, length: length };
    }
    for (var i = 0; i < tags.length; i++) {
        var t = tags[i];
        if (tabs[t]) {
            console.log('parsing table', t);
            const table = tables_1.tables[t.trim()].parse(data, tabs[t].offset, tabs[t].length, fontData);
            fontData[t.trim()] = table;
            font[t.trim()] = table;
        }
    }
    return font;
};
//# sourceMappingURL=index.js.map