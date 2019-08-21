"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lctf_1 = require("./lctf");
const binary_readers_1 = require("../binary-readers");
const parse = function (data, offset, length, font) {
    return lctf_1.lctf.parse(data, offset, length, font, subt);
};
const subt = function (data, ltype, offset) {
    var offset0 = offset;
    var tab = {};
    tab.fmt = binary_readers_1.readUint16(data, offset);
    offset += 2;
    if (ltype != 1 && ltype != 4 && ltype != 5 && ltype != 6)
        return null;
    if (ltype == 1 || ltype == 4 || (ltype == 5 && tab.fmt <= 2) || (ltype == 6 && tab.fmt <= 2)) {
        var covOff = binary_readers_1.readUint16(data, offset);
        offset += 2;
        tab.coverage = lctf_1.lctf.readCoverage(data, offset0 + covOff); // not always is coverage here
    }
    if (false) { }
    //  Single Substitution Subtable
    else if (ltype == 1) {
        if (tab.fmt == 1) {
            tab.delta = binary_readers_1.readInt16(data, offset);
            offset += 2;
        }
        else if (tab.fmt == 2) {
            var cnt = binary_readers_1.readUint16(data, offset);
            offset += 2;
            tab.newg = binary_readers_1.readUint16Array(data, offset, cnt);
            offset += tab.newg.length * 2;
        }
    }
    //  Ligature Substitution Subtable
    else if (ltype == 4) {
        tab.vals = [];
        var cnt = binary_readers_1.readUint16(data, offset);
        offset += 2;
        for (var i = 0; i < cnt; i++) {
            var loff = binary_readers_1.readUint16(data, offset);
            offset += 2;
            tab.vals.push(readLigatureSet(data, offset0 + loff));
        }
        //console.log(tab.coverage);
        //console.log(tab.vals);
    }
    //  Contextual Substitution Subtable
    else if (ltype == 5) {
        if (tab.fmt == 2) {
            var cDefOffset = binary_readers_1.readUint16(data, offset);
            offset += 2;
            tab.cDef = lctf_1.lctf.readClassDef(data, offset0 + cDefOffset);
            tab.scset = [];
            var subClassSetCount = binary_readers_1.readUint16(data, offset);
            offset += 2;
            for (var i = 0; i < subClassSetCount; i++) {
                var scsOff = binary_readers_1.readUint16(data, offset);
                offset += 2;
                tab.scset.push(scsOff == 0 ? null : readSubClassSet(data, offset0 + scsOff));
            }
        }
        //else console.log("unknown table format", tab.fmt);
    }
    //*
    else if (ltype == 6) {
        /*
        if(tab.fmt==2) {
          var btDef = readUshort(data, offset);  offset+=2;
          var inDef = readUshort(data, offset);  offset+=2;
          var laDef = readUshort(data, offset);  offset+=2;
    
          tab.btDef = lctf.readClassDef(data, offset0 + btDef);
          tab.inDef = lctf.readClassDef(data, offset0 + inDef);
          tab.laDef = lctf.readClassDef(data, offset0 + laDef);
    
          tab.scset = [];
          var cnt = readUshort(data, offset);  offset+=2;
          for(var i=0; i<cnt; i++) {
            var loff = readUshort(data, offset);  offset+=2;
            tab.scset.push(readChainSubClassSet(data, offset0+loff));
          }
        }
        */
        if (tab.fmt == 3) {
            for (var i = 0; i < 3; i++) {
                var cnt = binary_readers_1.readUint16(data, offset);
                offset += 2;
                var cvgs = [];
                for (var j = 0; j < cnt; j++)
                    cvgs.push(lctf_1.lctf.readCoverage(data, offset0 + binary_readers_1.readUint16(data, offset + j * 2)));
                offset += cnt * 2;
                if (i == 0)
                    tab.backCvg = cvgs;
                if (i == 1)
                    tab.inptCvg = cvgs;
                if (i == 2)
                    tab.ahedCvg = cvgs;
            }
            var cnt = binary_readers_1.readUint16(data, offset);
            offset += 2;
            tab.lookupRec = readSubstLookupRecords(data, offset, cnt);
        }
        //console.log(tab);
    } //*/
    //if(tab.coverage.indexOf(3)!=-1) console.log(ltype, fmt, tab);
    return tab;
};
const readSubClassSet = function (data, offset) {
    var offset0 = offset;
    var lset = [];
    var cnt = binary_readers_1.readUint16(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
        var loff = binary_readers_1.readUint16(data, offset);
        offset += 2;
        lset.push(readSubClassRule(data, offset0 + loff));
    }
    return lset;
};
const readSubClassRule = function (data, offset) {
    var offset0 = offset;
    var rule = {};
    var gcount = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var scount = binary_readers_1.readUint16(data, offset);
    offset += 2;
    rule.input = [];
    for (var i = 0; i < gcount - 1; i++) {
        rule.input.push(binary_readers_1.readUint16(data, offset));
        offset += 2;
    }
    rule.substLookupRecords = readSubstLookupRecords(data, offset, scount);
    return rule;
};
const readSubstLookupRecords = function (data, offset, cnt) {
    var out = [];
    for (var i = 0; i < cnt; i++) {
        out.push(binary_readers_1.readUint16(data, offset), binary_readers_1.readUint16(data, offset + 2));
        offset += 4;
    }
    return out;
};
const readChainSubClassSet = function (data, offset) {
    var offset0 = offset;
    var lset = [];
    var cnt = binary_readers_1.readUint16(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
        var loff = binary_readers_1.readUint16(data, offset);
        offset += 2;
        lset.push(readChainSubClassRule(data, offset0 + loff));
    }
    return lset;
};
const readChainSubClassRule = function (data, offset) {
    var offset0 = offset;
    var rule = {};
    var pps = ["backtrack", "input", "lookahead"];
    for (var pi = 0; pi < pps.length; pi++) {
        var cnt = binary_readers_1.readUint16(data, offset);
        offset += 2;
        if (pi == 1)
            cnt--;
        rule[pps[pi]] = binary_readers_1.readUint16Array(data, offset, cnt);
        offset += rule[pps[pi]].length * 2;
    }
    var cnt = binary_readers_1.readUint16(data, offset);
    offset += 2;
    rule.subst = binary_readers_1.readUint16Array(data, offset, cnt * 2);
    offset += rule.subst.length * 2;
    return rule;
};
const readLigatureSet = function (data, offset) {
    var offset0 = offset;
    var lset = [];
    var lcnt = binary_readers_1.readUint16(data, offset);
    offset += 2;
    for (var j = 0; j < lcnt; j++) {
        var loff = binary_readers_1.readUint16(data, offset);
        offset += 2;
        lset.push(readLigature(data, offset0 + loff));
    }
    return lset;
};
const readLigature = function (data, offset) {
    var lig = { chain: [] };
    lig.nglyph = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var ccnt = binary_readers_1.readUint16(data, offset);
    offset += 2;
    for (var k = 0; k < ccnt - 1; k++) {
        lig.chain.push(binary_readers_1.readUint16(data, offset));
        offset += 2;
    }
    return lig;
};
exports.GSUB = { parse };
//# sourceMappingURL=GSUB.js.map