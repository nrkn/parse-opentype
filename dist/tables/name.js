"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binary_readers_1 = require("../binary-readers");
const parse = function (data, offset, length) {
    var obj = {};
    var format = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var count = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var stringOffset = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var names = [
        "copyright",
        "fontFamily",
        "fontSubfamily",
        "ID",
        "fullName",
        "version",
        "postScriptName",
        "trademark",
        "manufacturer",
        "designer",
        "description",
        "urlVendor",
        "urlDesigner",
        "licence",
        "licenceURL",
        "---",
        "typoFamilyName",
        "typoSubfamilyName",
        "compatibleFull",
        "sampleText",
        "postScriptCID",
        "wwsFamilyName",
        "wwsSubfamilyName",
        "lightPalette",
        "darkPalette"
    ];
    var offset0 = offset;
    for (var i = 0; i < count; i++) {
        var platformID = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var encodingID = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var languageID = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var nameID = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var slen = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var noffset = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var cname = names[nameID];
        var soff = offset0 + count * 12 + noffset;
        var str;
        if (false) { }
        else if (platformID == 0)
            str = binary_readers_1.readUnicode(data, soff, slen / 2);
        else if (platformID == 3 && encodingID == 0)
            str = binary_readers_1.readUnicode(data, soff, slen / 2);
        else if (encodingID == 0)
            str = binary_readers_1.readAscii(data, soff, slen);
        else if (encodingID == 1)
            str = binary_readers_1.readUnicode(data, soff, slen / 2);
        else if (encodingID == 3)
            str = binary_readers_1.readUnicode(data, soff, slen / 2);
        else if (platformID == 1) {
            str = binary_readers_1.readAscii(data, soff, slen);
            console.log("reading unknown MAC encoding " + encodingID + " as ASCII");
        }
        else
            throw "unknown encoding " + encodingID + ", platformID: " + platformID;
        var tid = "p" + platformID + "," + (languageID).toString(16);
        if (obj[tid] == null)
            obj[tid] = {};
        obj[tid][cname] = str;
        obj[tid]._lang = languageID;
    }
    for (var p in obj)
        if (obj[p].postScriptName != null && obj[p]._lang == 0x0409)
            return obj[p]; // United States
    for (var p in obj)
        if (obj[p].postScriptName != null && obj[p]._lang == 0x0000)
            return obj[p]; // Universal
    for (var p in obj)
        if (obj[p].postScriptName != null && obj[p]._lang == 0x0c0c)
            return obj[p]; // Canada
    for (var p in obj)
        if (obj[p].postScriptName != null)
            return obj[p];
    var tname;
    for (var p in obj) {
        tname = p;
        break;
    }
    return obj[tname];
};
exports.name = { parse };
//# sourceMappingURL=name.js.map