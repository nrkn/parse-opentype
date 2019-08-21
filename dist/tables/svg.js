"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binary_readers_1 = require("../binary-readers");
const parse = function (data, offset, length) {
    var obj = { entries: [] };
    var offset0 = offset;
    var tableVersion = binary_readers_1.readUint16(data, offset);
    offset += 2;
    var svgDocIndexOffset = binary_readers_1.readUint32(data, offset);
    offset += 4;
    var reserved = binary_readers_1.readUint32(data, offset);
    offset += 4;
    offset = svgDocIndexOffset + offset0;
    var numEntries = binary_readers_1.readUint16(data, offset);
    offset += 2;
    for (var i = 0; i < numEntries; i++) {
        var startGlyphID = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var endGlyphID = binary_readers_1.readUint16(data, offset);
        offset += 2;
        var svgDocOffset = binary_readers_1.readUint32(data, offset);
        offset += 4;
        var svgDocLength = binary_readers_1.readUint32(data, offset);
        offset += 4;
        var sbuf = new Uint8Array(data.buffer, offset0 + svgDocOffset + svgDocIndexOffset, svgDocLength);
        var svg = binary_readers_1.readUtf8(sbuf, 0, sbuf.length);
        for (var f = startGlyphID; f <= endGlyphID; f++) {
            obj.entries[f] = svg;
        }
    }
    return obj;
};
const toPath = function (str) {
    var pth = { cmds: [], crds: [] };
    if (str == null)
        return pth;
    var prsr = new DOMParser();
    var doc = prsr["parseFromString"](str, "image/svg+xml");
    var svg = doc.firstChild;
    while (svg.tagName != "svg")
        svg = svg.nextSibling;
    var vb = svg.getAttribute("viewBox");
    if (vb)
        vb = vb.trim().split(" ").map(parseFloat);
    else
        vb = [0, 0, 1000, 1000];
    _toPath(svg.children, pth);
    for (var i = 0; i < pth.crds.length; i += 2) {
        var x = pth.crds[i];
        var y = pth.crds[i + 1];
        x -= vb[0];
        y -= vb[1];
        y = -y;
        pth.crds[i] = x;
        pth.crds[i + 1] = y;
    }
    return pth;
};
const _toPath = function (nds, pth, fill) {
    for (var ni = 0; ni < nds.length; ni++) {
        var nd = nds[ni], tn = nd.tagName;
        var cfl = nd.getAttribute("fill");
        if (cfl == null)
            cfl = fill;
        if (tn == "g")
            _toPath(nd.children, pth, cfl);
        else if (tn == "path") {
            pth.cmds.push(cfl ? cfl : "#000000");
            var d = nd.getAttribute("d"); //console.log(d);
            var toks = _tokens(d); //console.log(toks);
            _toksToPath(toks, pth);
            pth.cmds.push("X");
        }
        else if (tn == "defs") { }
        else
            console.log(tn, nd);
    }
};
const _tokens = function (d) {
    var ts = [];
    var off = 0;
    var rn = false;
    var cn = ""; // reading number, current number
    while (off < d.length) {
        var cc = d.charCodeAt(off), ch = d.charAt(off);
        off++;
        var isNum = (48 <= cc && cc <= 57) || ch == "." || ch == "-";
        if (rn) {
            if (ch == "-") {
                ts.push(parseFloat(cn));
                cn = ch;
            }
            else if (isNum)
                cn += ch;
            else {
                ts.push(parseFloat(cn));
                if (ch != "," && ch != " ")
                    ts.push(ch);
                rn = false;
            }
        }
        else {
            if (isNum) {
                cn = ch;
                rn = true;
            }
            else if (ch != "," && ch != " ")
                ts.push(ch);
        }
    }
    if (rn)
        ts.push(parseFloat(cn));
    return ts;
};
const _toksToPath = function (ts, pth) {
    var i = 0;
    var x = 0;
    var y = 0;
    var ox = 0;
    var oy = 0;
    var pc = { "M": 2, "L": 2, "H": 1, "V": 1, "S": 4, "C": 6 };
    var cmds = pth.cmds, crds = pth.crds;
    while (i < ts.length) {
        var cmd = ts[i];
        i++;
        if (cmd == "z") {
            cmds.push("Z");
            x = ox;
            y = oy;
        }
        else {
            var cmu = cmd.toUpperCase();
            var ps = pc[cmu], reps = _reps(ts, i, ps);
            for (var j = 0; j < reps; j++) {
                var xi = 0, yi = 0;
                if (cmd != cmu) {
                    xi = x;
                    yi = y;
                }
                if (false) { }
                else if (cmu == "M") {
                    x = xi + ts[i++];
                    y = yi + ts[i++];
                    cmds.push("M");
                    crds.push(x, y);
                    ox = x;
                    oy = y;
                }
                else if (cmu == "L") {
                    x = xi + ts[i++];
                    y = yi + ts[i++];
                    cmds.push("L");
                    crds.push(x, y);
                }
                else if (cmu == "H") {
                    x = xi + ts[i++];
                    cmds.push("L");
                    crds.push(x, y);
                }
                else if (cmu == "V") {
                    y = yi + ts[i++];
                    cmds.push("L");
                    crds.push(x, y);
                }
                else if (cmu == "C") {
                    const x1 = xi + ts[i++];
                    const y1 = yi + ts[i++];
                    const x2 = xi + ts[i++];
                    const y2 = yi + ts[i++];
                    const x3 = xi + ts[i++];
                    const y3 = yi + ts[i++];
                    cmds.push("C");
                    crds.push(x1, y1, x2, y2, x3, y3);
                    x = x3;
                    y = y3;
                }
                else if (cmu == "S") {
                    const co = Math.max(crds.length - 4, 0);
                    const x1 = x + x - crds[co];
                    const y1 = y + y - crds[co + 1];
                    const x2 = xi + ts[i++];
                    const y2 = yi + ts[i++];
                    const x3 = xi + ts[i++];
                    const y3 = yi + ts[i++];
                    cmds.push("C");
                    crds.push(x1, y1, x2, y2, x3, y3);
                    x = x3;
                    y = y3;
                }
                else
                    console.log("Unknown SVG command " + cmd);
            }
        }
    }
};
const _reps = function (ts, off, ps) {
    var i = off;
    while (i < ts.length) {
        if ((typeof ts[i]) == "string")
            break;
        i += ps;
    }
    return (i - off) / ps;
};
exports.SVG = { parse };
//# sourceMappingURL=svg.js.map