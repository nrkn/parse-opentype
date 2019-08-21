export interface Head {
    tableVersion: number;
    fontRevision: number;
    checkSumAdjustment: number;
    magicNumber: number;
    flags: number;
    unitsPerEm: number;
    created: number;
    modified: number;
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
    macStyle: number;
    lowestRecPPEM: number;
    fontDirectionHint: number;
    indexToLocFormat: number;
    glyphDataFormat: number;
}
export interface Hhea {
    ascender: number;
    descender: number;
    lineGap: number;
    advanceWidthMax: number;
    minLeftSideBearing: number;
    minRightSideBearing: number;
    xMaxExtent: number;
    caretSlopeRise: number;
    caretSlopeRun: number;
    caretOffset: number;
    metricDataFormat: number;
    numberOfHMetrics: number;
}
