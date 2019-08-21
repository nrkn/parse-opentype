export declare const tables: {
    CFF: {
        parse: (data: Uint8Array) => any;
        getCharString: (data: any, offset: any, o: any) => void;
        glyphBySE: (cff: any, charcode: any) => number;
    };
    cmap: {
        parse: (data: any, offset: any, length: any) => any;
    };
    glyf: {
        parse: (data: any, offset: any, length: any, font: any) => any[];
        parseGlyf: (font: any, g: any) => any;
    };
    GPOS: {
        parse: (data: any, offset: any, length: any, font: any) => {
            scriptList: {};
            featureList: any[];
            lookupList: {
                tabs: any[];
                ltype: number;
                flag: number;
            }[];
        };
    };
    GSUB: {
        parse: (data: any, offset: any, length: any, font: any) => {
            scriptList: {};
            featureList: any[];
            lookupList: {
                tabs: any[];
                ltype: number;
                flag: number;
            }[];
        };
    };
    head: {
        parse: (data: Uint8Array, offset: number) => import("./types").Head;
    };
    hhea: {
        parse: (data: Uint8Array, offset: number) => import("./types").Hhea;
    };
    hmtx: {
        parse: (data: any, offset: any, length: any, font: any) => any;
    };
    kern: {
        parse: (data: any, offset: any, length: number, font: any) => {
            glyph1: never[];
            rval: never[];
        };
    };
    loca: {
        parse: (data: any, offset: any, length: any, font: any) => any[];
    };
    maxp: {
        parse: (data: any, offset: any, length: any) => any;
    };
    name: {
        parse: (data: any, offset: any, length: any) => any;
    };
    'OS/2': {
        parse: (data: any, offset: any, length: any) => {};
    };
    post: {
        parse: (data: any, offset: any, length: any) => any;
    };
    SVG: {
        parse: (data: any, offset: any, length: any) => any;
    };
};
