"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binary_readers_1 = require("../binary-readers");
const util_1 = require("../util");
// OpenType Layout Common Table Formats
const parse = (data, offset, length, font, subt) => {
    const originalOffset = offset;
    const tableVersion = binary_readers_1.readFixed(data, offset);
    offset += 4;
    const offScriptList = binary_readers_1.readUint16(data, offset);
    offset += 2;
    const offFeatureList = binary_readers_1.readUint16(data, offset);
    offset += 2;
    const offLookupList = binary_readers_1.readUint16(data, offset);
    offset += 2;
    const scriptList = readScriptList(data, originalOffset + offScriptList);
    const featureList = readFeatureList(data, originalOffset + offFeatureList);
    const lookupList = readLookupList(data, originalOffset + offLookupList, subt);
    return { scriptList, featureList, lookupList };
};
const readLookupList = (data, offset, subt) => {
    const originalOffset = offset;
    const count = binary_readers_1.readUint16(data, offset);
    offset += 2;
    return util_1.createSequence(count, () => {
        const noff = binary_readers_1.readUint16(data, offset);
        offset += 2;
        const lut = readLookupTable(data, originalOffset + noff, subt);
        return lut;
    });
};
const readLookupTable = (data, offset, subt) => {
    const originalOffset = offset;
    const ltype = binary_readers_1.readUint16(data, offset);
    offset += 2;
    const flag = binary_readers_1.readUint16(data, offset);
    offset += 2;
    const count = binary_readers_1.readUint16(data, offset);
    offset += 2;
    const tabs = util_1.createSequence(count, () => {
        const noff = binary_readers_1.readUint16(data, offset);
        offset += 2;
        const tab = subt(data, ltype, originalOffset + noff);
        return tab;
    });
    return { tabs, ltype, flag };
};
const numOfOnes = (n) => {
    let num = 0;
    for (let i = 0; i < 32; i++)
        if (((n >>> i) & 1) != 0)
            num++;
    return num;
};
const readClassDef = (data, offset) => {
    var obj = [];
    var format = binary_readers_1.readUint16(data, offset);
    offset += 2;
    if (format === 1) {
        var startGlyph = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var glyphCount = binary_readers_1.readUint16(data, offset);
        offset += 2;
        for (var i = 0; i < glyphCount; i++) {
            obj.push(startGlyph + i);
            obj.push(startGlyph + i);
            obj.push(binary_readers_1.readUint16(data, offset));
            offset += 2;
        }
    }
    if (format === 2) {
        var count = binary_readers_1.readUint16(data, offset);
        offset += 2;
        for (var i = 0; i < count; i++) {
            obj.push(binary_readers_1.readUint16(data, offset));
            offset += 2;
            obj.push(binary_readers_1.readUint16(data, offset));
            offset += 2;
            obj.push(binary_readers_1.readUint16(data, offset));
            offset += 2;
        }
    }
    return obj;
};
const getInterval = (tab, val) => {
    for (var i = 0; i < tab.length; i += 3) {
        var start = tab[i], end = tab[i + 1], index = tab[i + 2];
        if (start <= val && val <= end)
            return i;
    }
    return -1;
};
const readCoverage = (data, offset) => {
    var cvg = {};
    cvg.fmt = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var count = binary_readers_1.readUint16(data, offset);
    offset += 2;
    if (cvg.fmt == 1)
        cvg.tab = binary_readers_1.readUint16Array(data, offset, count);
    if (cvg.fmt == 2)
        cvg.tab = binary_readers_1.readUint16Array(data, offset, count * 3);
    return cvg;
};
const coverageIndex = (cvg, val) => {
    var tab = cvg.tab;
    if (cvg.fmt == 1)
        return tab.indexOf(val);
    if (cvg.fmt == 2) {
        var ind = getInterval(tab, val);
        if (ind != -1)
            return tab[ind + 2] + (val - tab[ind]);
    }
    return -1;
};
const readFeatureList = (data, offset) => {
    var offset0 = offset;
    var obj = [];
    var count = binary_readers_1.readUint16(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
        var tag = binary_readers_1.readAscii(data, offset, 4);
        offset += 4;
        var noff = binary_readers_1.readUint16(data, offset);
        offset += 2;
        obj.push({ tag: tag.trim(), tab: readFeatureTable(data, offset0 + noff) });
    }
    return obj;
};
const readFeatureTable = (data, offset) => {
    var featureParams = binary_readers_1.readUint16(data, offset);
    offset += 2; // = 0
    var lookupCount = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var indices = [];
    for (var i = 0; i < lookupCount; i++)
        indices.push(binary_readers_1.readUint16(data, offset + 2 * i));
    return indices;
};
const readScriptList = (data, offset) => {
    var offset0 = offset;
    var obj = {};
    var count = binary_readers_1.readUint16(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
        var tag = binary_readers_1.readAscii(data, offset, 4);
        offset += 4;
        var noff = binary_readers_1.readUint16(data, offset);
        offset += 2;
        obj[tag.trim()] = readScriptTable(data, offset0 + noff);
    }
    return obj;
};
const readScriptTable = (data, offset) => {
    var offset0 = offset;
    var obj = {};
    var defLangSysOff = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.default = readLangSysTable(data, offset0 + defLangSysOff);
    var langSysCount = binary_readers_1.readUint16(data, offset);
    offset += 2;
    for (var i = 0; i < langSysCount; i++) {
        var tag = binary_readers_1.readAscii(data, offset, 4);
        offset += 4;
        var langSysOff = binary_readers_1.readUint16(data, offset);
        offset += 2;
        obj[tag.trim()] = readLangSysTable(data, offset0 + langSysOff);
    }
    return obj;
};
const readLangSysTable = (data, offset) => {
    var obj = {};
    var lookupOrder = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.reqFeature = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var featureCount = binary_readers_1.readUint16(data, offset);
    offset += 2;
    obj.features = binary_readers_1.readUint16Array(data, offset, featureCount);
    return obj;
};
exports.lctf = { parse, readCoverage, numOfOnes, readClassDef };
//# sourceMappingURL=lctf.js.map