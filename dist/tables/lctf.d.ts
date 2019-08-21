export declare const lctf: {
    parse: (data: Uint8Array, offset: number, length: number, font: any, subt: any) => {
        scriptList: {};
        featureList: any[];
        lookupList: {
            tabs: any[];
            ltype: number;
            flag: number;
        }[];
    };
    readCoverage: (data: any, offset: any) => any;
    numOfOnes: (n: number) => number;
    readClassDef: (data: any, offset: any) => number[];
};
