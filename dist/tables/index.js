"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cff_1 = require("./cff");
const cmap_1 = require("./cmap");
const glyf_1 = require("./glyf");
const GPOS_1 = require("./GPOS");
const GSUB_1 = require("./GSUB");
const head_1 = require("./head");
const hhea_1 = require("./hhea");
const hmtx_1 = require("./hmtx");
const kern_1 = require("./kern");
const loca_1 = require("./loca");
const maxp_1 = require("./maxp");
const name_1 = require("./name");
const os_2_1 = require("./os-2");
const post_1 = require("./post");
const svg_1 = require("./svg");
exports.tables = {
    CFF: cff_1.CFF, cmap: cmap_1.cmap, glyf: glyf_1.glyf, GPOS: GPOS_1.GPOS, GSUB: GSUB_1.GSUB, head: head_1.head, hhea: hhea_1.hhea, hmtx: hmtx_1.hmtx, kern: kern_1.kern, loca: loca_1.loca, maxp: maxp_1.maxp, name: name_1.name,
    'OS/2': os_2_1.OS2,
    post: post_1.post, SVG: svg_1.SVG
};
//# sourceMappingURL=index.js.map